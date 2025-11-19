import { collection, onSnapshot } from "firebase/firestore"
import { OrdenDeConsumo } from "../types/orden-de-consumo"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useOrdenesConsumos = () => {
    const [ordenesConsumos, setOrdenesConsumos] = useState<OrdenDeConsumo[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const consumoRef = collection(db, "ordenConsumo");

        const unsubscribe = onSnapshot(consumoRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as OrdenDeConsumo[];

            setOrdenesConsumos(data);
            setLoading(false);
            setError(null);
        }, (error) => {
            setError(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [])

    return { ordenesConsumos, loading, error }
}