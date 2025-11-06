import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export async function importJsonToCollection<T extends { id?: string }>(
    jsonData: T[],
    collectionName: string,
    options?: {
        convertDates?: boolean;
        overwrite?: boolean;
    }
) {
    const { convertDates = true, overwrite = true } = options || {};

    for (const item of jsonData) {
        let data = { ...item } as Record<string, any>;

        if (convertDates) {
            data = convertDatesToTimestamps(data);
        }

        if (item.id) {
            const docRef = doc(db, collectionName, item.id);
            await setDoc(docRef, data, { merge: overwrite });
        } else {
            const colRef = collection(db, collectionName);
            await addDoc(colRef, data);
        }
    }
}

function convertDatesToTimestamps(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "string" && /\d{4}-\d{2}-\d{2}T/.test(value)) {
            // 🔁 Convierte string ISO -> Firebase Timestamp
            result[key] = Timestamp.fromDate(new Date(value));
        } else if (value instanceof Date) {
            result[key] = Timestamp.fromDate(value);
        } else if (typeof value === "object" && value !== null) {
            result[key] = convertDatesToTimestamps(value);
        } else {
            result[key] = value;
        }
    }

    return result;
}