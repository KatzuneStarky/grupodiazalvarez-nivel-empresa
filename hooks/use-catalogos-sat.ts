import { ProductoSAT, UnidadSAT } from "@/types/catalogos-sat";
import { useEffect, useState } from "react";

export const useCatalogosSAT = () => {
    const [productos, setProductos] = useState<ProductoSAT[]>([]);
    const [unidades, setUnidades] = useState<UnidadSAT[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!query) {
            setUnidades([]);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        fetch(`/api/sat/unidades?q=${encodeURIComponent(query)}`, {
            signal: controller.signal
        })
            .then(res => res.json())
            .then((data) => setUnidades(data))
            .catch(err => {
                if (err.name !== "AbortError") setError("Error al cargar unidades SAT");
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [query]);

    useEffect(() => {
        if (!query) {
            setProductos([]);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        fetch(`/api/sat/productos?q=${encodeURIComponent(query)}`, {
            signal: controller.signal
        })
            .then(res => res.json())
            .then((data) => setProductos(data))
            .catch(err => {
                if (err.name !== "AbortError") setError("Error al cargar productos SAT");
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [query]);


    return { unidades, productos, query, setQuery, error, loading }
}