import { collection, onSnapshot } from "firebase/firestore"
import { EstacionServicio } from "../types/estacion"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useEstaciones = () => {
    const [estaciones, setEstaciones] = useState<EstacionServicio[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | undefined>()

    useEffect(() => {
        const estacionesRef = collection(db, "estacionServicio");

        const unsubscribe = onSnapshot(estacionesRef, (querySnapshot) => {
            const estacionesData: EstacionServicio[] = [];
            querySnapshot.forEach((doc) => {
                estacionesData.push({ id: doc.id, ...doc.data() } as EstacionServicio);
            });
            setEstaciones(estacionesData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error obteniendo a las estaciones:", error);
            setError(error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { estaciones, isLoading, error };
}