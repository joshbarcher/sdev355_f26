import { useState, useEffect } from 'react';

export function useFetch(url, initialData, deps = []) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(url, { method: "get" });
                if (!res.ok) throw new Error("Error loading data");
                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } 
        load();
    }, [url, ...deps])

    return { data, setData, loading, error }
}