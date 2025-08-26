import { collection, onSnapshot } from "firebase/firestore"
import { Clientes } from "../types/clientes"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useClientes = () => {
    const [clientes, setClientes] = useState<Clientes[] | null>([])
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const clientesRef = collection(db, "clientes");

        const unsubscribe = onSnapshot(clientesRef, (querySnapshot) => {
            const clientesData: Clientes[] = [];
            querySnapshot.forEach((doc) => {
                clientesData.push({ id: doc.id, ...doc.data() } as Clientes);
            });
            setClientes(clientesData);
            setLoading(false);
        }, (error) => {
            console.error("Error obteniendo los clientes:", error);
            setError(error);
            setLoading(false);
        });

        return () => unsubscribe();
    })

    return { clientes, loading, error }
}