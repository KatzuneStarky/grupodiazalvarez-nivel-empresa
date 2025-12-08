import { collection, onSnapshot } from "firebase/firestore"
import { Incidencia } from "../types/incidencias"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useIncidencias = () => {
    const [incidencias, setIncidencias] = useState<Incidencia[]>([])
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const consumoRef = collection(db, "incidencias");

        const unsubscribe = onSnapshot(consumoRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Incidencia[];

            setIncidencias(data);
            setLoading(false);
            setError(null);
        }, (error) => {
            setError(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [])

    return {
        incidencias,
        error,
        loading,
    }
}