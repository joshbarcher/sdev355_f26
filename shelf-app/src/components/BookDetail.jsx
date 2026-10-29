import { useFetch } from "../hooks/hooks"

export default function BookDetail({ id }) {
    const {
        data: book,
        loading,
        error 
    } = useFetch(`http://localhost:4000/api/books/${id}`, {}, [id])

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