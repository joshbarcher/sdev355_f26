import Header from "./components/Header"
import Footer from "./components/Footer"
import BookCard from "./components/BookCard"
import Panel from "./components/Panel"
import Search from "./components/Search"
import AddForm from './components/AddForm'
import { useState, useEffect } from 'react'

export default function App() {
    const [books, setBooks] = useState([]);
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
            try {
                const res = await fetch("http://localhost:4000/api/books", { method: "get" });
                if (!res.ok) return;

                const json = await res.json();
                setBooks(json);
            } catch (err) {
                console.log(err);
            }
        }
        load();
        
    }, [])

    return (
        <div className="app">
            <Header />
            <Search value={query} onQueryChange={setQuery} />
            <hr />
            <Search value={query} onQueryChange={setQuery} />
            <AddForm onAdd={addBook} />
            <hr />

            {cards("Currently reading", currentlyReading)}
            {cards("Want to read", wishlist)}
            {cards("Finished reading", finishedReading)}

            <Footer></Footer>
        </div>
    )
}