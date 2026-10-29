import { Link } from "react-router";
import { useFetch } from "../hooks/hooks"

export default function Header() {
    const { data: books } = useFetch("http://localhost:4000/api/books", []);
    const numBooks = books.length;

    return (
        <>
            <header className="header">
                <h1 className="header-title">Shelf</h1>
                <p className="header-meta">Josh - {numBooks} books</p>
            </header>
            
            <nav>
                <ul>
                    <li className="nav-item"><Link to="/">Home</Link></li>
                    <li className="nav-item"><Link to="/books">Shelf</Link></li>
                    <li className="nav-item"><Link to="/about">About</Link></li>
                </ul>
            </nav>
        </>
    )
}

