
export default function Panel({ title, children}) {
    return (
        <section className="panel">
            <h2 className="panel-title">{title}</h2>
            <div className="panel-body">
                { children }
            </div>
        </section>
    )
}