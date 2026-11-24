import { useState, useContext, useRef } from "react";
import { BookContext } from "../context/BookProvider";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

function AddBook() {
    const { register, handleSubmit } = useForm();
    const { data: books, setData: setBooks } = useContext(BookContext);
    const navigate = useNavigate();

    function addBook(data) {
        const book = {
            id: crypto.randomUUID(),
            title: data.title.trim(),
            author: data.author.trim(),
            status: "want",
            tags: [],
        };

        setBooks([...books, book]);
        navigate("/books");
    }

    return (
        <form className="add" onSubmit={handleSubmit(addBook)}>
            <input
                { ...register("title") }
                className="add-input"
                placeholder="Enter title"
            />
            <input
                { ...register("author") }
                className="add-input"
                placeholder="Enter author"
            />
            <button className="add-button">Add</button>
        </form>
    );
}

export default AddBook;
