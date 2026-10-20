# shelf-api

The backend the Shelf talks to from **week 4 onward**. It runs on the student's
own laptop, next to the Vite dev server, and it is the thing `fetch` points at
for the rest of the quarter.

```bash
npm install
npm run dev          # http://localhost:4000
```

That is the whole setup. No database to install, no account to make, no
connection string to get wrong.

**Port 4000 is not a free choice.** `w10.2` already has
`const BASE = "http://localhost:4000"` on a slide and calls it "a constant since
Week 4". The decks picked it first; this follows them.

## Sign in

Two accounts, same password:

| email | password |
|---|---|
| `josh@example.com` | `password123` |
| `student@example.com` | `password123` |

Two rather than one so week 9 can show that signing in as someone else changes
who the API says you are.

## The endpoints

Reading is public. **Changing anything needs a token.** That one rule is what
makes week 9 teachable: signed out, the shelf still loads and every button
fails with a 401 — which is exactly the situation a protected route exists for.

| | | |
|---|---|---|
| `GET` | `/api/books` | the list. `?status=reading` and `?q=brooks` both work |
| `GET` | `/api/books/:id` | one book, or a 404 |
| `POST` | `/api/books` | 🔒 create. A title is all it needs |
| `PATCH` | `/api/books/:id` | 🔒 change some fields, leave the rest |
| `DELETE` | `/api/books/:id` | 🔒 204, no body |
| `POST` | `/api/auth/login` | `{ email, password }` → `{ token, user }` |
| `POST` | `/api/auth/logout` | see below — it does less than you expect |
| `GET` | `/api/me` | 🔒 who this token says you are |
| `POST` | `/api/reset` | the fifteen seed books, back again |
| `GET` | `/health` | `{ status: "ok" }` |

A book looks exactly like a book in `demos/355/shelf`:

```json
{
  "id": "b1",
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "status": "reading",
  "rating": 4,
  "tags": ["classic", "fiction"],
  "notes": "The courtroom chapters are the ones people remember, but it is Scout who carries it."
}
```

`status` is one of `want`, `reading`, `finished` — the three in the app's own
`StatusTag.jsx`. `rating` is **absent**, not null, on a book nobody has read.

## Making it misbehave, on purpose

A loading spinner you cannot see is a loading spinner nobody believes in. On
localhost every request comes back in two milliseconds, so week 4's `loading`
state flashes past and the error branch never runs at all.

So slowness and failure are asked for in the URL, where they are visible in
DevTools, in the slide, and in the student's own address bar:

```
GET /api/books?delay=2000      take two seconds
GET /api/books?fail=500        answer 500, with a JSON error body
GET /api/books?fail=401        any 4xx or 5xx works
```

`SHELF_DELAY_MS=400 npm run dev` puts a floor under **every** request, which is
the honest setting for a whole session — it makes localhost feel like a network
without any deck having to ask.

## Things that are deliberate

**The data is in memory.** Restarting throws away every change and puts the seed
books back. For teaching that is a feature: every session starts from the same
the same books, and `POST /api/reset` gets there without a restart.

**Seed books `b1`–`b5` are byte-for-byte the app's hardcoded array; `b6`–`b15` were added later.** In week 4
the app stops holding its own array and starts fetching this one, and *the
screen does not change* — which is the whole point of that session. If these
drift from `demos/355/shelf/src/App.jsx`, the week 4 demo stops proving
anything.

**Logout barely does anything, and that is the lesson.** A JWT is not a session
the server can end; it is a signed note that stays valid until it expires,
wherever it happens to be. Logging out means the *client* throwing its copy
away. The endpoint exists so the app has something to call and so the answer is
written down somewhere a student can find it.

**The JWT secret is a constant in a file everyone can read.** Fine here and
nowhere else: this serves one person on one laptop. Deployed, it comes from the
environment — the same point `w10.2` makes about `VITE_API_URL`.

**Ids are `b1`, `b2`, `b6`…, not UUIDs.** A student typing `/books/b3` into the
address bar while learning dynamic routes in week 6 should be able to see and
say the id out loud.

## Tests

```bash
npm test             # 17 tests, vitest + supertest
```

They bind no port: `createApp({ store })` builds the app and the tests drive the
real routes against a fresh store each time.

## Open — not yet claimed by a deck

`?status=` and `?q=` do server-side filtering and search. The app currently
filters and searches in the browser, and whether any session teaches doing it on
the server is a question for the week 4 and week 6 outlines. They are here
because they cost nothing; nothing is obliged to use them.
