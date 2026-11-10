import { useEffect, useState } from "react";

export function useFetch(url, initialData) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reloads, setReloads] = useState(0);

    useEffect(() => {
        let ignore = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`the server answered ${res.status}`);
                const body = await res.json();
                if (!ignore) setData(body);
            } catch (err) {
                console.error(err);
                if (!ignore) setError(err.message);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();

        return () => {
            ignore = true;
        };
    }, [url, reloads]);

    function retry() {
        setReloads((n) => n + 1);
    }

    return { data, setData, loading, error, retry };
}
