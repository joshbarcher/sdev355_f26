import { NavLink } from "react-router";

import JumpToBook from "./JumpToBook.jsx";

function navClass({ isActive }) {
    return isActive ? "nav-link nav-on" : "nav-link";
}

function Nav() {
    return (
        <nav className="nav">
            <NavLink end to="/" className={navClass}>
                Home
            </NavLink>
            <NavLink end to="/books" className={navClass}>
                My shelf
            </NavLink>
            <NavLink to="/books/reading" className={navClass}>
                Reading
            </NavLink>
            <NavLink to="/books/want" className={navClass}>
                Want to read
            </NavLink>
            <NavLink to="/books/done" className={navClass}>
                Finished
            </NavLink>
            <NavLink to="/about" className={navClass}>
                About
            </NavLink>
            <NavLink to="/books/new" className={navClass}>
                New Book
            </NavLink>
            <JumpToBook />
        </nav>
    );
}

export default Nav;
