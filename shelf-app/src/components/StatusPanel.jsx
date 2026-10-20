
export default function StatusPanel({ status, children }) {
    return (
        <section className="panel">
            <h2 className="panel-title">Your shelf</h2>
            <p className={`state state-${status}`}>{children}</p>
        </section>
    )
}