import { firestore } from "@/firebase/server";
import { NextResponse } from "next/server"

const PAGE_SIZE = 500;

async function exportCollectionPaginated(collectionPath: string) {
    const data: any[] = [];
    let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | undefined = undefined;

    while (true) {
        let query = firestore.collection(collectionPath).limit(PAGE_SIZE);
        if (lastDoc) query = query.startAfter(lastDoc);

        const snapshot = await query.get();
        snapshot.docs.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });

        if (snapshot.docs.length < PAGE_SIZE) break;
        lastDoc = snapshot.docs[snapshot.docs.length - 1];
    }

    return data;
}

async function exportAllCollections() {
    const collections = await firestore.listCollections();
    const exportData: Record<string, any[]> = {};

    for (const col of collections) {
        exportData[col.id] = await exportCollectionPaginated(col.id);
    }

    return exportData;
}

export async function GET() {
    try {
        const data = await exportAllCollections();
        const json = JSON.stringify(data, null, 2);

        return new NextResponse(json, {
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": "attachment; filename=firestore-export.json",
            },
        });
    } catch (err) {
        console.error(err);
        return new NextResponse("Error exporting Firestore data", { status: 500 });
    }
}