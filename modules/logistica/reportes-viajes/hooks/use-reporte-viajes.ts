"use client"

import { collection, onSnapshot } from "firebase/firestore";
import { ReporteViajes } from "../types/reporte-viajes";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";

export const useReporteViajes = () => {
    const [reporteViajes, setReporteViajes] = useState<ReporteViajes[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const reporteViajesRef = collection(db, "reporteViajes");

        const unsubscribe = onSnapshot(reporteViajesRef, (querySnapshot) => {
            const reporteViajesData: ReporteViajes[] = [];
            querySnapshot.forEach((doc) => {
                reporteViajesData.push({ id: doc.id, ...doc.data() } as ReporteViajes);
            });
            setReporteViajes(reporteViajesData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error obteniendo los reporteViajes:", error);
            setError(error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { reporteViajes, isLoading, error };
};