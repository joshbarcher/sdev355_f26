
export default function BookCard({title, author, books,
                                  pages = 0, rating = 0}) {

    //derived value                                
    const cleanTitle = title.toUpperCase();

    return (
        <article className="card">
            <h3 className="card-title">{cleanTitle}</h3>
            <p className="card-author">{author}</p>
            <p>Pages: {pages}</p>
            <p>{rating === 0 ? "---" : "★".repeat(rating)}</p>
            <span>Read carefully!</span>
        </article>
    )
}