"use client"

import { Estaciones } from "../../types/estaciones/estaciones";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";

export const useEstaciones = () => {
    const [estaciones, setEstaciones] = useState<Estaciones[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const estacionesRef = collection(db, "estaciones");

        const unsubscribe = onSnapshot(estacionesRef, (querySnapshot) => {
            const estacionesData: Estaciones[] = [];
            querySnapshot.forEach((doc) => {
                estacionesData.push({ id: doc.id, ...doc.data() } as Estaciones);
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