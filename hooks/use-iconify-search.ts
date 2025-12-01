import { useEffect, useState } from "react";

export function useIconifySearch(query: string) {
    const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://api.iconify.design/search?query=${query}&limit=50`);
                const json = await res.json();
                setResults(json.icons || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    return { results, loading };
}