import { collection, onSnapshot } from "firebase/firestore"
import { Incidencia } from "../types/incidencias"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useIncidencias = (equipoId: string) => {
    const [incidencias, setIncidencias] = useState<Incidencia[]>([])
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!equipoId) {
            setIncidencias([]);
            setLoading(false);
            setError(null);
            return;
        }

        const incidenciasCollectionRef = collection(db, "equipos", equipoId, "incidencias");

        setLoading(true);
        setError(null);

        const unsubscribe = onSnapshot(incidenciasCollectionRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Incidencia[];

            setIncidencias(data);
            setLoading(false);
            setError(null);
        }, (err) => {
            setError(err);
            setLoading(false);
            setIncidencias([]);
        });

        return () => unsubscribe();
    }, [equipoId])

    return {
        incidencias,
        error,
        loading,
    }
}