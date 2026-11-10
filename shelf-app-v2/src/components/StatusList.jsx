
import Panel from "./Panel.jsx";
import BookCard from "./BookCard.jsx";
import ShelfBody from "./ShelfBody.jsx";
import { BookContext } from "../context/BookProvider.jsx";
import { useContext } from "react";

function StatusList({ status, title }) {

    const {
        data: books, 
        setData: setBooks, 
        loading, error, retry} = useContext(BookContext);

    function changeStatus(id, next) {
        setBooks(
            books.map((book) => (book.id === id ? { ...book, status: next } : book))
        );
    }

    const shown = books.filter((book) => book.status === status);

    return (
        <ShelfBody loading={loading} error={error} books={books} onRetry={retry}>
            <Panel title={title}>
                {shown.map((book) => (
                    <BookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        status={book.status}
                        rating={book.rating}
                        tags={book.tags}
                        notes={book.notes}
                        onStatusChange={(next) => changeStatus(book.id, next)}
                    />
                ))}
            </Panel>
        </ShelfBody>
    );
}

export default StatusList;
