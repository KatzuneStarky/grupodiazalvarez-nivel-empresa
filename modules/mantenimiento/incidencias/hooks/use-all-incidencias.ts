import { collectionGroup, onSnapshot, query, orderBy } from "firebase/firestore"
import { Incidencia } from "../types/incidencias"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useAllIncidencias = () => {
    const [incidencias, setIncidencias] = useState<Incidencia[]>([])
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
        // Query all 'incidencias' collections across the database
        const q = query(collectionGroup(db, "incidencias")) // Can add orderBy here if indexes allow

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Incidencia[]

            setIncidencias(data)
            setLoading(false)
        }, (err) => {
            console.error("Error fetching all incidencias:", err)
            setError(err)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return {
        incidencias,
        loading,
        error
    }
}
