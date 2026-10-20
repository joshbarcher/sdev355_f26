import StatusPanel from "./StatusPanel";

export default function BookShelf({ books, loading, error, children }) {
    if (loading) return <StatusPanel status="wait">Books are loading...</StatusPanel>;
    if (error) return <StatusPanel status="failed">Failed to load books...</StatusPanel>;
    if (books.length === 0) return <StatusPanel status="empty">No books added yet...</StatusPanel>;

    //the regular bookshelf
    return children;
}