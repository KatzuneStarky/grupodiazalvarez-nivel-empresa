import { Timestamp, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/client";

export async function exportCollectionToJson<T extends Record<string, any>>(
    collectionName: string
): Promise<(T & { id: string })[]> {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);

    const data: Array<T & { id: string }> = [];

    snapshot.forEach((doc) => {
        const docData = doc.data() as T;
        const parsedData = convertTimestampsToDates(docData);

        // ✅ Casteamos a unknown primero (recomendado por TS)
        const item = { id: doc.id, ...parsedData } as unknown as T & { id: string };

        data.push(item);
    });

    return data;
}

function convertTimestampsToDates(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value instanceof Timestamp) {
            result[key] = value.toDate();
        } else if (typeof value === "object" && value !== null) {
            result[key] = convertTimestampsToDates(value);
        } else {
            result[key] = value;
        }
    }
    return result;
}