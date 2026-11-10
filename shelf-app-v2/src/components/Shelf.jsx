import { useEffect, useState } from "react";

import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import Header from "./Header.jsx";
import Panel from "./Panel.jsx";
import BookCard from "./BookCard.jsx";
import NowReading from "./NowReading.jsx";
import SearchBox from "./SearchBox.jsx";
import AddBook from "./AddBook.jsx";
import ShelfBody from "./ShelfBody.jsx";
import { BookContext } from "../context/BookProvider.jsx";
import { useContext } from "react";

function Shelf() {
    const { 
        data: books, 
        setData: setBooks, 
        loading, error, retry } = useContext(BookContext);

    const [hideFinished, setHideFinished] = useState(false);
    const [query, setQuery] = useState("");
    const [currentId, setCurrentId] = useState(null);

    const settled = useDebouncedValue(query, 300);

    function changeStatus(id, status) {
        setBooks(
            books.map((book) => (book.id === id ? { ...book, status } : book))
        );

        if (status === "reading") {
            setCurrentId(id);
        } else if (id === currentId) {
            setCurrentId(null);
        }
    }

    function addBook(title) {
        const book = {
            id: crypto.randomUUID(),
            title,
            author: "Unknown author",
            status: "want",
            tags: [],
        };

        setBooks([...books, book]);
    }

    const matching = books.filter((book) =>
        book.title.toLowerCase().includes(settled.toLowerCase())
    );
    const shown = hideFinished
        ? matching.filter((book) => book.status !== "finished")
        : matching;
    const current = books.find((book) => book.id === currentId);

    const reading = shown.filter((book) => book.status === "reading");
    const want = shown.filter((book) => book.status === "want");
    const finished = shown.filter((book) => book.status === "finished");
    const abandoned = shown.filter((book) => book.status === "abandoned");

    const finishedCount = books.filter((b) => b.status === "finished").length;

    useEffect(() => {
        document.title =
            query === ""
                ? `Shelf — ${shown.length} books`
                : `Shelf — ${shown.length} of ${books.length} shown`;
    }, [shown.length, books.length, query]);

    useEffect(() => {
        function handleKeyDown(event) {
            const typing = event.target.closest?.("input, textarea, select");
            if (typing) return;

            if (event.key === "f") {
                setHideFinished((on) => !on);
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    function cards(list) {
        return list.map((book) => (
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
        ));
    }

    return (
        <>
            <Header
                owner="Josh"
                bookCount={books.length}
                finishedCount={finishedCount}
                hideFinished={hideFinished}
                onHideFinishedChange={setHideFinished}
            />

            <NowReading book={current} />

            <SearchBox value={query} onChange={setQuery} />
            <AddBook onAdd={addBook} />

            <ShelfBody
                loading={loading}
                error={error}
                books={books}
                onRetry={retry}
            >
                <Panel title="Currently reading">{cards(reading)}</Panel>
                <Panel title="Want to read">{cards(want)}</Panel>
                <Panel title="Finished">{cards(finished)}</Panel>
                <Panel title="Gave up on">{cards(abandoned)}</Panel>
            </ShelfBody>
        </>
    );
}

export default Shelf;
