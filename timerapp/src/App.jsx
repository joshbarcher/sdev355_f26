import { useState, useEffect } from 'react'

function App() {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!started) return;

        const timer = setInterval(() => setCount(old => old + 1), 1000);

        //clean up function, this runs first if you call the effect function again
        return () => clearInterval(timer);
    }, [started])

    function toggleStarted() {
        setStarted(flag => !flag);
    }

    return (
        <>
            <h1>Timer App</h1>
            <button onClick={toggleStarted}>{started ? "Stop" : "Start"}</button>
            <p>Count is {count}</p>
        </>
    )
}

export default App
