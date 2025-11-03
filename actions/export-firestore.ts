"use server"

import { firestore } from "@/firebase/server"

export async function getCollectionData(collectionPath: string): Promise<any[]> {
    const snapshot = await firestore.collection(collectionPath).get()
    const data: any[] = []

    for (const doc of snapshot.docs) {
        const docData = doc.data()
        const subcollections = await doc.ref.listCollections()
        const subData: Record<string, any> = {}

        for (const sub of subcollections) {
            subData[sub.id] = await getCollectionData(`${collectionPath}/${doc.id}/${sub.id}`)
        }

        data.push({
            id: doc.id,
            ...docData,
            ...subData,
        })
    }

    return data
}