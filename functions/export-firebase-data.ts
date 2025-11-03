import { getCollectionData } from "@/actions/export-firestore"
import { firestore } from "@/firebase/server"

export async function exportFirestoreData() {
    const collections = await firestore.listCollections()
    const exportData: Record<string, any[]> = {}

    for (const collection of collections) {
        exportData[collection.id] = await getCollectionData(collection.id)
    }

    return exportData
}