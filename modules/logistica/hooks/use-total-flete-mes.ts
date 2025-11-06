import { collection, onSnapshot, query, where } from "firebase/firestore";
import { ReporteViajes } from "../reportes-viajes/types/reporte-viajes";
import { useEffect, useState } from "react";
import { meses } from "@/constants/meses";
import { db } from "@/firebase/client";

export const useTotalFletePorMes = (year: number) => {
    const [totalFletePorMes, setTotalFletePorMes] = useState<{ Mes: string; TotalFlete: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!year) return;

        const q = query(
            collection(db, "reporteViajes"),
            where("Year", "==", year)
        );

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const data: ReporteViajes[] = [];

                querySnapshot.forEach((doc) => {
                    data.push(doc.data() as ReporteViajes);
                });

                const result = data.reduce((acc, curr) => {
                    const mes = curr.Mes?.trim() || "Sin mes";
                    if (!acc[mes]) acc[mes] = 0;
                    acc[mes] += curr.Flete || 0;
                    return acc;
                }, {} as Record<string, number>);

                const totalFletePorMes = meses.map((mes) => ({
                    Mes: mes,
                    TotalFlete: result[mes] || 0,
                }));

                setTotalFletePorMes(totalFletePorMes);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error obteniendo los datos:", error);
                setError(error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [year]);

    return { totalFletePorMes, isLoading, error };
};