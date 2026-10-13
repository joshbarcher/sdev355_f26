
export default function BookCard({book}) {

    //derived value                                
    const cleanTitle = book.title.toUpperCase();

    const bookRating = book.rating || 3;
    const ratingString = bookRating > 0 && <p>{"★".repeat(bookRating)}</p>;

    return (
        <article className="card">
            <h3 className="card-title">{cleanTitle}</h3>
            <p className="card-author">{book.author}</p>
            <p>Pages: {book.pages}</p>
            {ratingString}
            <span>Read carefully!</span>
        </article>
    )
}