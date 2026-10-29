import Header from "./layout/Header.jsx"
import Footer from "./layout/Footer.jsx"
import BookCard from "./components/BookCard"
import Panel from "./components/Panel"
import Search from "./components/Search"
import AddForm from './components/AddForm'
import BookShelf from "./components/BookShelf"
import BookDetail from './components/BookDetail'
import { useState } from 'react'
import { useFetch, useDebounce } from './hooks/hooks.js';

export default function App() {
    const { 
        data: books, 
        setData: setBooks,
        loading, 
        error 
    } = useFetch("http://localhost:4000/api/books?delay=2000", [], []);

    const [reloads, setReloads] = useState(0);
    const [selectedId, setSelectedId] = useState("b2");
    const [query, setQuery] = useState("");

    function addBook(title) {
        const book = {
            id: title, 
            title: title,
            author: "",
            status: "reading",
            pages: 0,
            tags: []
        }

        //don't change the original state in books, create a new array
        setBooks([ ...books, book]);
    }

    function cards(title, books) {
        return (
            <Panel title={title}>
                {books.length > 0 && books.map(book => <BookCard key={book.id} book={book} /> )}
            </Panel>
        )
    }

    function handleReload() {
        console.log("Trying to reload!");
        setReloads(num => num + 1);
    }

    //filter on the search value
    const settled = useDebounce(query, 500);
    const filteredBooks = settled ? 
        books.filter(el => el.title.toLowerCase().includes(settled.toLowerCase())) : 
        books;

    //derived values
    const currentlyReading = filteredBooks.filter(el => el.status === "reading");
    const finishedReading = filteredBooks.filter(el => el.status === "finished");
    const wishlist = filteredBooks.filter(el => el.status === "want");
    const unstarted = filteredBooks.filter(el => el.status === "unstarted");

    return (
        <>
            <hr />
            <Search value={query} onQueryChange={setQuery} />
            <AddForm onAdd={addBook} />
            <hr />
            <button className="reload-button" onClick={handleReload}>Reload Books!</button>
            <hr />

            <BookDetail id={selectedId} />
            <button className="btn" onClick={() => setSelectedId("b3")}>Read new book!</button>
            <label>Selected id is {selectedId}</label>
            <hr />

            <BookShelf books={books} error={error} loading={loading}>
                {cards("Currently reading", currentlyReading)}
                {cards("Want to read", wishlist)}
                {cards("Finished reading", finishedReading)}
            </BookShelf>

            <Footer></Footer>
        </>
    )
}