import { getStorageUsagePerSubfolder } from "@/modules/logistica/equipos/documentos/actions/read";
import { useEffect, useState } from "react";

export function useStorageUsagePerSubfolder(folder?: string, refreshInterval: number = 30000) {
    const [storageData, setStorageData] = useState<Record<string, { archivos: number; archivosVencimiento: number; certificado: number }> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchStorageUsage() {
            try {
                setLoading(true);
                const data = await getStorageUsagePerSubfolder(folder);
                if (isMounted) {
                    setStorageData(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) setError("Error al obtener el uso de almacenamiento.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchStorageUsage();
        const interval = setInterval(fetchStorageUsage, refreshInterval);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [folder, refreshInterval]);

    return { storageData, loading, error };
}