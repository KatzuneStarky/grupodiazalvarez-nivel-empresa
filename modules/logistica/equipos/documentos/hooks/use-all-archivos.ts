import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento";
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados";
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos";
import { subscribeToAllArchivos } from "../actions/read";
import { useEffect, useState } from "react";

type ArchivoUnion = Archivo | Certificado | ArchivosVencimiento;

export const useAllArchivos = () => {
    const [archivos, setArchivos] = useState<ArchivoUnion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        try {
            const unsubscribe = subscribeToAllArchivos((data) => {
                const sortedData
                    = data.sort((a, b) =>
                        new Date(b.createAt).getTime() -
                        new Date(a.createAt).getTime());
                setArchivos(sortedData);
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Error en la consulta de archivos:", error);
            setError(error as Error);
            setLoading(false);
        }
    }, []);

    return { archivos, loading, error };
};