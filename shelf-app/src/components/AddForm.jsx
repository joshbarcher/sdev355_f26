import { useState } from "react";

export default function AddForm({ onAdd }) {
    const [draft, setDraft] = useState("");

    function handleForm(e) {
        e.preventDefault();

        if (draft) {
            console.log(`Adding draft: ${draft}`)
            onAdd(draft);
            setDraft("");
        }
    }

    return (
        <div className="add">
            <input type="text" className="add-input" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button onClick={handleForm}>Add</button>
        </div>
    )
}