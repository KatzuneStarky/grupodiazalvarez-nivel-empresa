import { collection, onSnapshot } from "firebase/firestore"
import { ConsumoCombustible } from "../types/consumo"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useConsumo = () => {
    const [consumo, setConsumo] = useState<ConsumoCombustible[]>()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const consumoRef = collection(db, "consumo");

        const unsubscribe = onSnapshot(consumoRef, (querySnapshot) => {
            const consumoData: ConsumoCombustible[] = [];
            querySnapshot.forEach((doc) => {
                consumoData.push({ id: doc.id, ...doc.data() } as ConsumoCombustible);
            });
            setConsumo(consumoData);
            setLoading(false);
        }, (error) => {
            console.error("Error obteniendo a los consumos:", error);
            setError(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return {
        consumo,
        loading,
        error
    }
}