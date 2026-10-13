
export default function Search({ value, onQueryChange }) {
    return (
        <div className="search">
            <input 
                type="text"
                value={value} 
                onChange={(evt) => onQueryChange(evt.target.value)} 
                className="search-input" 
            />
        </div>
    )
}