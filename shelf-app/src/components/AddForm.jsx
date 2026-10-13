import { useState } from "react";

export default function AddForm({ onAdd }) {
    const [draft, setDraft] = useState("");

    return (
        <>
            <label>Add Book</label>
            <div className="add">
                <input 
                    type="text" 
                    className="add-input" 
                    value={draft} 
                    onChange={(e) => setDraft(e.target.value)} 
                />
                <button className="add-button" onClick={() => onAdd(draft)}>Add</button>
            </div>
        </>
    )
}