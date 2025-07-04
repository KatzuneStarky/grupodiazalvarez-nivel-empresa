"use client"

import { collection, onSnapshot } from "firebase/firestore"
import { Empresa } from "../types/empresas"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useAllEmpreas = () => {
    const [empresas, setEmpresas] = useState<Empresa[]>([])
    const [error, setError] = useState<Error | undefined>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const estacionesRef = collection(db, "empresas");

        const unsubscribe = onSnapshot(estacionesRef, (querySnapshot) => {
            const estacionesData: Empresa[] = [];
            querySnapshot.forEach((doc) => {
                estacionesData.push({ id: doc.id, ...doc.data() } as Empresa);
            });
            setEmpresas(estacionesData);
            setLoading(false);
        }, (error) => {
            console.error("Error obteniendo a las estaciones:", error);
            setError(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { empresas, error, loading }
}