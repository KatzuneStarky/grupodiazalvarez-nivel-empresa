import { collection, onSnapshot } from "firebase/firestore"
import { Inventario } from "../types/inventario"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useInventarioTaller = () => {
    const [inventarioTaller, setInventarioTaller] = useState<Inventario[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const clientesRef = collection(db, "inventario_taller");

        const unsubscribe = onSnapshot(clientesRef, (querySnapshot) => {
            const inventarioData: Inventario[] = [];
            querySnapshot.forEach((doc) => {
                inventarioData.push({ id: doc.id, ...doc.data() } as Inventario);
            });
            setInventarioTaller(inventarioData);
            setLoading(false);
        }, (error) => {
            console.error("Error obteniendo los inventarios:", error);
            setError(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [])

    return { inventarioTaller, loading, error }
}