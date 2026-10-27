import { useState, useEffect } from 'react';

export default function BookDetail({ id }) {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //read the book that matches this id
    useEffect(() => {
        const load = async () => {
            //clean up state to track the fetch() call
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`http://localhost:4000/api/books/${id}?delay=2000`, { method: "get" });
                if (!res.ok) throw new Error("Error loading book");

                const json = await res.json();
                setBook(json);
                console.log(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id])

    if (loading) {
        return <section className="detail">Loading the book...</section>
    } else if (error) {
        return <section className="detail">Error - {error}</section>
    }

    return (
        <section className="detail">
            <div className="detail-top">
                <h2 className="detail-title">Title: {book.title}</h2>
            </div>
            <p>Author: {book.author}</p>
        </section>
    )
}