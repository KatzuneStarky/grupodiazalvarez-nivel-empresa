import { Query, collection, onSnapshot, query, where } from "firebase/firestore";
import { ReporteViajes } from "../types/reporte-viajes";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";

export const useFaltantesViajes = (
    mes?: string,
    year?: number,
    cliente?: string,
    descripcion?: string,
    municipio?: string
) => {
    const [viajes, setViajes] = useState<ReporteViajes[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let q: Query = collection(db, "reporteViajes");

        const conditions = [];
        if (mes) conditions.push(where("Mes", "==", mes));
        if (year) conditions.push(where("Year", "==", year));
        if (cliente) conditions.push(where("Cliente", "==", cliente));
        if (descripcion) conditions.push(where("DescripcionDelViaje", "==", descripcion));
        if (municipio) conditions.push(where("Municipio", "==", municipio));

        if (conditions.length > 0) {
            q = query(q, ...conditions);
        }

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const data: ReporteViajes[] = [];
                querySnapshot.forEach((doc) => {
                    const docData = doc.data() as ReporteViajes;
                    data.push({ ...docData, id: doc.id });
                });

                setViajes(data);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error fetching viajes:", error);
                setError(error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [mes, year, cliente, descripcion, municipio]);

    return { viajes, isLoading, error };
}