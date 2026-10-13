import Header from "./components/Header"
import Footer from "./components/Footer"
import BookCard from "./components/BookCard"
import Panel from "./components/Panel"

const BOOKS = [
    {
        id: "b1",
        title: "Red Rising",
        author: "Pierce Brown",
        status: "reading",
        rating: 5,
        tags: ["sci-fi", "dystopian", "series"],
    },
    {
        id: "b2",
        title: "The Eye of the World",
        author: "Robert Jordan",
        status: "reading",
        rating: 4,
        tags: ["fantasy", "epic", "series"],
    },
    {
        id: "b3",
        title: "Harry Potter and the Prisoner of Azkaban",
        author: "J.K. Rowling",
        status: "finished",
        rating: 5,
        tags: ["fantasy", "series"],
    },
    {
        id: "b4",
        title: "The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        status: "want",
        rating: 0,
        tags: ["fantasy", "classic", "series"],
    },
    {
        id: "b5",
        title: "The Hunger Games",
        author: "Suzanne Collins",
        status: "finished",
        rating: 4,
        tags: ["dystopian", "ya", "series"],
    },
    {
        id: "b6",
        title: "The Body Keeps The Score",
        author: "Bessel van der Kolk",
        status: "unstarted",
        rating: 5,
        tags: ["self help", "psychology"],
    },
];

const currentlyReading = BOOKS.filter(el => el.status === "reading");
const finishedReading = BOOKS.filter(el => el.status === "finished");
const wishlist = BOOKS.filter(el => el.status === "want");
const unstarted = BOOKS.filter(el => el.status === "unstarted");

export default function App() {
    return (
        <div className="app">
            <Header />

            <Panel title="Currently reading">
                {currentlyReading.length > 0 && 
                 currentlyReading.map(book => <BookCard key={book.id} book={book} /> )}
                
            </Panel>

            <Panel title="Want to read">
                {wishlist.length > 0 && 
                 wishlist.map(book => <BookCard key={book.id} book={book} /> )}
            </Panel>

            <Panel title="Finished reading">
                {finishedReading.length > 0 && 
                 finishedReading.map(book => <BookCard key={book.id} book={book} /> )}
            </Panel>

            <Footer></Footer>
        </div>
    )
}