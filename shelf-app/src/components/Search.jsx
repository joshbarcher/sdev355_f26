

export default function Search({ value, onQueryChange }) {

    function clear() {
        onChange("");
    }

    return (
        <div className="search">
            <input type="text" value={value} onChange={e => onQueryChange(e.target.value)} className="search-input" />
            <button onClick={clear} className="search-clear">Clear</button>
        </div>
    )
}