import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
    const [count, setCount] = useState(0);
    const [clicked, setClicked] = useState(false);

    function handleClick() {
        setCount(old => old + 1);  
    }

    function toggleClick() {
        setClicked(old => !old);
    }

    //run some code as a side effect
    useEffect(() => {
        document.title = "Effects page";
        console.log("Rendered the page title");
    }, [clicked]);

    return (
        <>
            <h1>Hello, from my effects page</h1>
            <button onClick={handleClick}>Click - {count} times</button>
            <button onClick={toggleClick}>Click me - {clicked ? "Yes" : "No"}</button>
        </>
    )
}

export default App
