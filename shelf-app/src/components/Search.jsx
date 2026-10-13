
export default function Search({ value, onQueryChange }) {
    return (
        <>
            <label>Search</label>
            <div className="search">
                <input 
                    type="text"
                    value={value} 
                    onChange={(evt) => onQueryChange(evt.target.value)} 
                    className="search-input" 
                />
            </div>
        </>
    )
}