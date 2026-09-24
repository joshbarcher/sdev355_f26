import Header from "./Header"
import Footer from "./Footer"
import BookCard from "./BookCard"
import Panel from "./Panel"

export default function App() {
    return (
        <div className="app">
            <Header />

            <Panel title="Currently reading">
                <BookCard 
                    title="To Kill A Mockingbird"
                    author="Harper Lee"
                    pages={323}
                />
                <BookCard
                    title="The Hunger Games"
                    author="Suzanne Collins"
                    rating="5"
                    books={ ['Hunger Games', 'Mockingjay', 'Catching Fire'] }
                />
            </Panel>

            <Panel title="Want to read">
                <BookCard
                    title="Harry Potter"
                    author="J.K. Rowling"
                    rating="5"
                />
                <BookCard
                    title="Pride and Prejudice"
                    author="Jane Austen"
                    rating="4"
                />
            </Panel>

            <Footer></Footer>
        </div>
    )
}