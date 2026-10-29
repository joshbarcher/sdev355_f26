import { useRef, useEffect } from "react";

export default function Search({ value, onQueryChange }) {
    const searchBox = useRef(null);

    //focus teh search on load
    useEffect(() => {
        console.log(searchBox);
        searchBox.current.focus();
    }, [])

    function handleClear() {
        //clear out the search
        onQueryChange("");
        searchBox.current.focus();
    }

    return (
        <>
            <label>Search</label>
            <div className="search">
                <input 
                    ref={searchBox}
                    type="text"
                    value={value} 
                    onChange={(evt) => onQueryChange(evt.target.value)} 
                    className="search-input" 
                />
                <button className="btn" onClick={handleClear}>Clear</button>
            </div>
        </>
    )
}