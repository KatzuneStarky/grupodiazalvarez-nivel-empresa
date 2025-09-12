import { doc, onSnapshot } from "firebase/firestore"
import { Inventario } from "../types/inventario"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useInventarioTallerById = (inventarioId: string) => {
    const [inventarioTaller, setInventarioTaller] = useState<Inventario | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!inventarioId) return;

        const inventarioRef = doc(db, "inventario_taller", inventarioId);

        const unsubscribe = onSnapshot(
            inventarioRef,
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const inventarioData = {
                        id: docSnapshot.id,
                        ...docSnapshot.data(),
                    } as Inventario;

                    setInventarioTaller(inventarioData);
                } else {
                    setInventarioTaller(null);
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error obteniendo inventario:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [inventarioId]);

    return { inventarioTaller, loading, error };
};