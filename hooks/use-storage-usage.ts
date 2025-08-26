"use client"

import { getTotalStorageUsage } from "@/modules/logistica/equipos/documentos/actions/read";
import { useEffect, useState } from "react";

export function useStorageUsage(folder?: string, refreshInterval: number = 30000) {
    const [storageUsage, setStorageUsage] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchStorageUsage() {
            try {
                setLoading(true);
                const size = await getTotalStorageUsage(folder);
                if (isMounted) {
                    setStorageUsage(size);
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

    return { storageUsage, loading, error };
}