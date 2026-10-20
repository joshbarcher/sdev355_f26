/**
 * In-memory data, seeded at startup.
 *
 * Deliberately not a database. A student clones this, runs `npm install` and
 * `npm run dev`, and it works -- no Postgres to install, no connection string
 * to get wrong, no migration step between them and the lesson. This course is
 * about React; the API is the thing React talks to, not the subject.
 *
 * The consequence is real and worth saying out loud in class: restarting the
 * server throws away every change and puts the seed books back. That is a
 * feature for teaching -- every session starts from the same books -- and
 * it is why POST /api/reset exists rather than being a bug to work around.
 */

/**
 * b1-b5 are EXACTLY the hardcoded BOOKS array in demos/355/shelf. b6-b15 were
 * added later for a longer list; they are not in the app's array.
 *
 * That is on purpose. In week 4 the app stops holding its own array and starts
 * fetching this one, and the screen does not change -- which is the whole point
 * of that session. If these drift from the app's array, the week 4 demo stops
 * proving anything. demos/355/shelf/src/App.jsx is the source; this follows it.
 *
 * Note `rating` is absent on the two `want` books, not null. A book you have
 * not read does not have a rating, and the UI already handles the missing key.
 */
const SEED_BOOKS = [
	{
		id: 'b1',
		title: 'To Kill a Mockingbird',
		author: 'Harper Lee',
		status: 'reading',
		rating: 4,
		tags: ['classic', 'fiction'],
		notes: 'The courtroom chapters are the ones people remember, but it is Scout who carries it.'
	},
	{
		id: 'b2',
		title: 'The Hunger Games',
		author: 'Suzanne Collins',
		status: 'reading',
		rating: 5,
		tags: ['dystopia', 'ya'],
		notes: 'Read the first fifty pages on a lunch break and lost the rest of the day.'
	},
	{
		id: 'b3',
		title: "Harry Potter and the Sorcerer's Stone",
		author: 'J.K. Rowling',
		status: 'want',
		tags: ['fantasy', 'series'],
		notes: 'Somehow never read it. Everyone insists I start here rather than the films.'
	},
	{
		id: 'b4',
		title: 'Pride and Prejudice',
		author: 'Jane Austen',
		status: 'want',
		tags: ['classic'],
		notes: 'Told it is much funnier than its reputation suggests.'
	},
	{
		id: 'b5',
		title: '1984',
		author: 'George Orwell',
		status: 'finished',
		rating: 4,
		tags: ['classic', 'dystopia'],
		notes: 'The appendix on Newspeak is the part that actually keeps you up at night.'
	},
	{
		id: 'b6',
		title: 'The Hobbit',
		author: 'J.R.R. Tolkien',
		status: 'finished',
		rating: 5,
		tags: ['fantasy', 'classic'],
		notes: 'Riddles in the Dark is still the best chapter.'
	},
	{
		id: 'b7',
		title: 'Fahrenheit 451',
		author: 'Ray Bradbury',
		status: 'finished',
		rating: 4,
		tags: ['classic', 'dystopia'],
		notes: 'Short enough to read in a weekend, and it reads faster than that.'
	},
	{
		id: 'b8',
		title: 'The Great Gatsby',
		author: 'F. Scott Fitzgerald',
		status: 'finished',
		rating: 3,
		tags: ['classic', 'fiction'],
		notes: 'Admired it more than enjoyed it. The last page earns its reputation.'
	},
	{
		id: 'b9',
		title: 'Dune',
		author: 'Frank Herbert',
		status: 'reading',
		rating: 4,
		tags: ['sci-fi', 'series'],
		notes: 'Keeping the glossary in the back open the whole time.'
	},
	{
		id: 'b10',
		title: 'The Martian',
		author: 'Andy Weir',
		status: 'finished',
		rating: 5,
		tags: ['sci-fi'],
		notes: 'The log-entry format makes it hard to stop at the end of a chapter.'
	},
	{
		id: 'b11',
		title: 'Project Hail Mary',
		author: 'Andy Weir',
		status: 'reading',
		rating: 5,
		tags: ['sci-fi'],
		notes: 'Better not to know anything about it going in.'
	},
	{
		id: 'b12',
		title: 'The Fellowship of the Ring',
		author: 'J.R.R. Tolkien',
		status: 'want',
		tags: ['fantasy', 'series'],
		notes: 'Next after The Hobbit.'
	},
	{
		id: 'b13',
		title: 'Brave New World',
		author: 'Aldous Huxley',
		status: 'want',
		tags: ['classic', 'dystopia'],
		notes: 'Meant to read it alongside 1984 and compare the two.'
	},
	{
		id: 'b14',
		title: 'The Name of the Wind',
		author: 'Patrick Rothfuss',
		status: 'want',
		tags: ['fantasy', 'series'],
		notes: 'Recommended by three different people this year.'
	},
	{
		id: 'b15',
		title: 'Frankenstein',
		author: 'Mary Shelley',
		status: 'want',
		tags: ['classic', 'horror'],
		notes: 'Told the novel has very little in common with the films.'
	}
];

export const STATUSES = ['want', 'reading', 'finished'];

/**
 * Ids are b1, b2, b3... and a new book continues the run.
 *
 * Not randomUUID, which is what a real API would use. A student reading a
 * response in DevTools, or typing a URL like /books/b3 by hand while learning
 * dynamic routes in week 6, should be able to see and say the id out loud.
 * `b6` is a readable id; `9f2c81e0-...` is not, and week 6 is hard enough.
 */
function nextId(books) {
	const numbers = books.map((book) => Number(book.id.slice(1))).filter(Number.isFinite);
	return 'b' + (Math.max(0, ...numbers) + 1);
}

export function createStore() {
	// structuredClone so the seed is never mutated -- reset() has to be able to
	// hand back the original seed however badly the last session mangled them.
	let books = structuredClone(SEED_BOOKS);

	return {
		books({ status, q } = {}) {
			let found = books;
			if (status) found = found.filter((book) => book.status === status);
			if (q) {
				const needle = q.toLowerCase();
				found = found.filter(
					(book) =>
						book.title.toLowerCase().includes(needle) ||
						book.author.toLowerCase().includes(needle)
				);
			}
			return found;
		},

		book(id) {
			return books.find((book) => book.id === id);
		},

		addBook({ title, author, status, rating, tags, notes }) {
			const book = {
				id: nextId(books),
				title,
				// The app's own defaults, not invented ones: demos/355/shelf
				// addBook(title) builds exactly this from a title alone, so a
				// title-only POST and the week 3 app produce the same book.
				author: author ?? 'Unknown author',
				status: status ?? 'want',
				tags: tags ?? [],
				notes: notes ?? ''
			};
			// Same shape rule as the seed: no rating key unless there is a rating.
			if (rating !== undefined) book.rating = rating;
			books = [...books, book];
			return book;
		},

		updateBook(id, changes) {
			const book = books.find((b) => b.id === id);
			if (!book) return undefined;
			const updated = { ...book, ...changes, id: book.id };
			books = books.map((b) => (b.id === id ? updated : b));
			return updated;
		},

		removeBook(id) {
			const book = books.find((b) => b.id === id);
			if (!book) return undefined;
			books = books.filter((b) => b.id !== id);
			return book;
		},

		reset() {
			books = structuredClone(SEED_BOOKS);
			return books;
		}
	};
}
