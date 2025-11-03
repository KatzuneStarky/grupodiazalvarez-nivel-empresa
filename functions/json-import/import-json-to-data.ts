import { collection, doc, setDoc } from "firebase/firestore";
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
        const data = { ...item } as Record<string, any>;

        if (convertDates) {
            for (const key in data) {
                if (typeof data[key] === "string" && /\d{4}-\d{2}-\d{2}T/.test(data[key])) {
                    data[key] = new Date(data[key]);
                }
            }
        }

        if (item.id) {
            const docRef = doc(db, collectionName, item.id);
            if (overwrite) {
                await setDoc(docRef, data, { merge: true });
            } else {
                await setDoc(docRef, data, { merge: false });
            }
        } else {
            const colRef = collection(db, collectionName);
            await setDoc(doc(colRef), data);
        }
    }
}