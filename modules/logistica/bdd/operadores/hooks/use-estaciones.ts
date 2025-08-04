"use client"

import { collection, onSnapshot } from "firebase/firestore";
import { Operador } from "../types/operadores";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";

export const useOperadores = () => {
    const [operadores, setOperadores] = useState<Operador[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const operadoresRef = collection(db, "operadores");

        const unsubscribe = onSnapshot(operadoresRef, (querySnapshot) => {
            const operadoresData: Operador[] = [];
            querySnapshot.forEach((doc) => {
                operadoresData.push({ id: doc.id, ...doc.data() } as Operador);
            });
            setOperadores(operadoresData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error obteniendo los operadores:", error);
            setError(error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { operadores, isLoading, error };
}