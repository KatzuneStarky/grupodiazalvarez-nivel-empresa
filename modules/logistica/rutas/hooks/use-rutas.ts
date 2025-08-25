import { collection, onSnapshot } from "firebase/firestore"
import { Ruta } from "../../equipos/types/rutas"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useRutas = () => {
    const [rutas, setRutas] = useState<Ruta[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const rutasRef = collection(db, "rutas");

        const unsubscribe = onSnapshot(rutasRef, (querySnapshot) => {
            const rutaData: Ruta[] = [];
            querySnapshot.forEach((doc) => {
                rutaData.push({ id: doc.id, ...doc.data() } as Ruta);
            });
            setRutas(rutaData);
            setLoading(false);
        }, (error) => {
            console.error("Error obteniendo los operadores:", error);
            setError(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [])

    return { rutas, loading, error }
}