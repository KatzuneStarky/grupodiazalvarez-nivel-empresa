import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"
import { OrdenMantenimiento } from "@/modules/mantenimiento/types/orden-mantenimiento"

export const useOrdenesMantenimiento = () => {
    const [ordenes, setOrdenes] = useState<OrdenMantenimiento[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        setIsLoading(true)
        const q = query(
            collection(db, "ordenes-mantenimiento"),
            orderBy("createAt", "desc")
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as OrdenMantenimiento[]

            setOrdenes(data)
            setIsLoading(false)
        }, (err) => {
            console.error("Error fetching ordenes mantenimiento:", err)
            setError(err)
            setIsLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return {
        ordenes,
        isLoading,
        error
    }
}
