import Header from "./components/Header"
import Footer from "./components/Footer"
import BookCard from "./components/BookCard"
import Panel from "./components/Panel"
import Search from "./components/Search"
import AddForm from './components/AddForm'
import BookShelf from "./components/BookShelf"
import BookDetail from './components/BookDetail'
import { useState, useEffect } from 'react'

export default function App() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    const filteredBooks = query ? 
        books.filter(el => el.title.toLowerCase().includes(query.toLowerCase())) : 
        books;

    //derived values
    const currentlyReading = filteredBooks.filter(el => el.status === "reading");
    const finishedReading = filteredBooks.filter(el => el.status === "finished");
    const wishlist = filteredBooks.filter(el => el.status === "want");
    const unstarted = filteredBooks.filter(el => el.status === "unstarted");

    useEffect(() => {
        const load = async () => {
            //clean up state to track the fetch() call
            setLoading(true);
            setError(null);

            try {
                const res = await fetch("http://localhost:4000/api/books?delay=2000", { method: "get" });
                if (!res.ok) throw new Error("Error loading shelf data");

                const json = await res.json();
                setBooks(json);
            } catch (err) {
                setError(err.message);
            } finally {
                //last step, always runs
                setLoading(false);
            }
        }
        load();
        
    }, [reloads])

    return (
        <div className="app">
            <Header />
            <Search value={query} onQueryChange={setQuery} />
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
        </div>
    )
}