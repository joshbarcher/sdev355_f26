
import { useFetch } from "../hooks/useFetch.js";
import { API } from "../api.js";
import { createContext } from 'react';

export const BookContext = createContext(null);

export default function BookProvider({ children }) {
    const results = useFetch(API, []);

    return (
        <BookContext value={results}>
            { children }
        </BookContext>
    )
}