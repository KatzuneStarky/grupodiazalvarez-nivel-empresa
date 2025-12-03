import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { Mecanico } from "../../types/mecanico"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useMecanicos = () => {
    const [mecanicos, setMecanicos] = useState<Mecanico[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        const q = query(
            collection(db, "mecanicos"),
            orderBy("createdAt", "desc"),
            limit(100)
        )

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const mecanicosData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }) as Mecanico)
            setMecanicos(mecanicosData)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching mecanicos:", error)
            setError("Error fetching mecanicos")
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return {
        mecanicos,
        error,
        loading
    }
}