import { getStorageUsagePerSubfolderEquipo, StorageUsage } from "../actions/read";
import { useEffect, useState } from "react";

export function useStorageUsagePerSubfolderEquipo(folder?: string, eId?: string, refreshInterval: number = 30000) {
    const [storageData, setStorageData] = useState<StorageUsage | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!folder || !eId) return;

        let isMounted = true;

        async function fetchStorageUsage() {
            try {
                setLoading(true);
                const data = await getStorageUsagePerSubfolderEquipo(folder || "", eId || "");
                console.log("Storage data:", data);

                if (isMounted) {
                    setStorageData(data);
                    setError(null);
                }
            } catch (err) {
                console.error(err);
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
    }, [folder, eId, refreshInterval]);

    return { storageData, loading, error };
}