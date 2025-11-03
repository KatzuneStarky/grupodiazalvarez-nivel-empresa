import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/client";

export async function exportCollectionToJson<T>(collectionName: string): Promise<T[]> {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);

    const data: T[] = [];
    snapshot.forEach(doc => {
        const docData = doc.data() as T;

        data.push({ id: doc.id, ...docData });
    });

    return data;
}