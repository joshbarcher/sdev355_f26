import express from 'express';
import cors from 'cors';
import { createStore, STATUSES } from './store.js';
import { requireAuth, signIn } from './auth.js';
import { lab } from './lab.js';

/**
 * The API, as an Express app that is never started here.
 *
 * `server.js` listens; this file only builds. That split is what lets the
 * tests drive the real routes without binding a port.
 *
 * THE SHAPE OF IT, AND WHY
 *
 * Reading is public; changing anything needs a token. That one rule is what
 * makes week 9 teachable: signed out, the shelf still loads and every button
 * fails with a 401, which is exactly the situation a protected route exists to
 * handle. If everything were public there would be nothing to protect, and if
 * everything were private the app would be a login screen until week 9.
 */
export function createApp({ store = createStore() } = {}) {
	const app = express();

	// Vite dev serves the app on 5173 and this runs on 4000, so every single
	// request from the app is cross-origin. Without this line the browser
	// blocks the response and the console blames CORS, not the missing header.
	// Wide open is right for a server that only ever listens to localhost;
	// w10.2 s36 is where that becomes a real origin.
	app.use(cors());
	app.use(express.json());

	// Before every route, so ?delay= and ?fail= work on all of them.
	app.use(lab);

	app.get('/health', (req, res) => res.json({ status: 'ok' }));

	// ── books ───────────────────────────────────────────────────────────────

	app.get('/api/books', (req, res) => {
		const { status, q } = req.query;
		if (status && !STATUSES.includes(status)) {
			return res.status(400).json({ error: `status must be one of ${STATUSES.join(', ')}` });
		}
		res.json(store.books({ status, q }));
	});

	app.get('/api/books/:id', (req, res) => {
		const book = store.book(req.params.id);
		// Week 6 types /books/b99 into the address bar to see this happen.
		if (!book) return res.status(404).json({ error: 'no such book' });
		res.json(book);
	});

	app.post('/api/books', requireAuth, (req, res) => {
		const problems = validate(req.body ?? {}, { partial: false });
		if (problems.length) return res.status(400).json({ error: problems.join('; ') });
		res.status(201).json(store.addBook(req.body));
	});

	app.patch('/api/books/:id', requireAuth, (req, res) => {
		const problems = validate(req.body ?? {}, { partial: true });
		if (problems.length) return res.status(400).json({ error: problems.join('; ') });
		const book = store.updateBook(req.params.id, req.body);
		if (!book) return res.status(404).json({ error: 'no such book' });
		res.json(book);
	});

	app.delete('/api/books/:id', requireAuth, (req, res) => {
		const book = store.removeBook(req.params.id);
		if (!book) return res.status(404).json({ error: 'no such book' });
		// 204: it worked and there is nothing to say. `await res.json()` on a
		// 204 throws, which is a good thing for a student to meet once.
		res.status(204).end();
	});

	// ── who you are ─────────────────────────────────────────────────────────

	app.post('/api/auth/login', (req, res) => {
		const { email, password } = req.body ?? {};
		const result = signIn(email, password);
		if (!result) return res.status(401).json({ error: 'wrong email or password' });
		res.json(result);
	});

	/**
	 * There is no server-side logout, and that is the lesson.
	 *
	 * A JWT is not a session the server can end -- it is a signed note that
	 * stays valid until it expires, wherever it happens to be. Logging out
	 * means the CLIENT throwing its copy away. This endpoint exists so the
	 * app has something to call and so the answer is written down somewhere a
	 * student can find it.
	 */
	app.post('/api/auth/logout', (req, res) => {
		res.json({ ok: true, note: 'a JWT cannot be revoked; delete your copy of the token' });
	});

	app.get('/api/me', requireAuth, (req, res) => res.json(req.user));

	// ── back to the seed books ──────────────────────────────────────────────────

	app.post('/api/reset', (req, res) => res.json(store.reset()));

	// Anything else is a 404 as JSON, not Express's HTML page -- a client that
	// always parses JSON should never be handed a stack trace in markup.
	app.use((req, res) => res.status(404).json({ error: 'not found' }));

	return app;
}

/**
 * One validator for POST and PATCH.
 *
 * `partial` is the difference between them: creating a book requires a title
 * and an author, updating one only has to be valid about the fields it sends.
 * Getting that wrong is how a PATCH that changes a rating wipes the title.
 */
function validate(body, { partial }) {
	const problems = [];
	const has = (key) => body[key] !== undefined;

	// Title is the only thing a book cannot be created without, because that is
	// all the app asks for: demos/355/shelf addBook(title) fills in the author
	// and the status itself. Requiring more here would mean the API rejecting
	// the app the course has already taught. Everything else is checked only if
	// it was sent -- which is also exactly what PATCH needs.
	if (!partial || has('title')) {
		if (typeof body.title !== 'string' || !body.title.trim()) {
			problems.push('title is required');
		}
	}
	if (has('author') && (typeof body.author !== 'string' || !body.author.trim())) {
		problems.push('author must be a non-empty string');
	}
	if (has('status') && !STATUSES.includes(body.status)) {
		problems.push(`status must be one of ${STATUSES.join(', ')}`);
	}
	if (has('rating') && !(Number.isInteger(body.rating) && body.rating >= 1 && body.rating <= 5)) {
		problems.push('rating must be a whole number from 1 to 5');
	}
	if (has('tags') && !(Array.isArray(body.tags) && body.tags.every((t) => typeof t === 'string'))) {
		problems.push('tags must be an array of strings');
	}
	return problems;
}
