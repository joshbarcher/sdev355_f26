import { describe, expect, it, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';
import { createStore } from './store.js';

/**
 * Every route, and the rules that make week 9 teachable.
 *
 * A fresh store per test, because the store is mutable and a test that passes
 * only when it runs third is worse than no test.
 */
let app;

beforeEach(() => {
	app = createApp({ store: createStore() });
});

const signIn = async () => {
	const res = await request(app)
		.post('/api/auth/login')
		.send({ email: 'josh@example.com', password: 'password123' });
	return res.body.token;
};

describe('reading is public', () => {
	it('lists the fifteen seed books', async () => {
		const res = await request(app).get('/api/books');
		expect(res.status).toBe(200);
		expect(res.body).toHaveLength(15);
		expect(res.body[0].title).toBe('To Kill a Mockingbird');
	});

	it('keeps rating off a book that has none', async () => {
		const res = await request(app).get('/api/books/b3');
		expect(res.status).toBe(200);
		expect('rating' in res.body).toBe(false);
	});

	it('filters by status and searches title and author', async () => {
		expect((await request(app).get('/api/books?status=reading')).body).toHaveLength(4);
		expect((await request(app).get('/api/books?q=orwell')).body).toHaveLength(1);
	});

	it('rejects a status that is not one of the three', async () => {
		const res = await request(app).get('/api/books?status=abandoned');
		expect(res.status).toBe(400);
	});

	it('404s an unknown book, as JSON', async () => {
		const res = await request(app).get('/api/books/b99');
		expect(res.status).toBe(404);
		expect(res.body.error).toBe('no such book');
	});
});

describe('changing anything needs a token', () => {
	it('401s a POST with no token at all', async () => {
		const res = await request(app).post('/api/books').send({ title: 'Anything' });
		expect(res.status).toBe(401);
	});

	it('401s a token that is not ours', async () => {
		const res = await request(app)
			.post('/api/books')
			.set('authorization', 'Bearer not.a.real.token')
			.send({ title: 'Anything' });
		expect(res.status).toBe(401);
	});

	it('401s the right password on the wrong email, with the same message', async () => {
		const wrongEmail = await request(app)
			.post('/api/auth/login')
			.send({ email: 'nobody@example.com', password: 'password123' });
		const wrongPassword = await request(app)
			.post('/api/auth/login')
			.send({ email: 'josh@example.com', password: 'nope' });
		expect(wrongEmail.status).toBe(401);
		expect(wrongPassword.body.error).toBe(wrongEmail.body.error);
	});

	it('signs in and says who you are, without leaking the hash', async () => {
		const token = await signIn();
		const res = await request(app).get('/api/me').set('authorization', `Bearer ${token}`);
		expect(res.status).toBe(200);
		expect(res.body.name).toBe('Josh');
		expect(res.body.hash).toBeUndefined();
		expect(res.body.salt).toBeUndefined();
	});
});

describe('writing', () => {
	it('creates a book from a title alone, the way the app does', async () => {
		const token = await signIn();
		const res = await request(app)
			.post('/api/books')
			.set('authorization', `Bearer ${token}`)
			.send({ title: 'Working Effectively with Legacy Code' });
		expect(res.status).toBe(201);
		expect(res.body).toMatchObject({
			id: 'b16',
			author: 'Unknown author',
			status: 'want',
			tags: []
		});
	});

	it('refuses a book with no title', async () => {
		const token = await signIn();
		const res = await request(app)
			.post('/api/books')
			.set('authorization', `Bearer ${token}`)
			.send({ author: 'Nobody' });
		expect(res.status).toBe(400);
	});

	it('patches one field without wiping the rest', async () => {
		const token = await signIn();
		const res = await request(app)
			.patch('/api/books/b1')
			.set('authorization', `Bearer ${token}`)
			.send({ status: 'finished' });
		expect(res.status).toBe(200);
		expect(res.body.status).toBe('finished');
		expect(res.body.title).toBe('To Kill a Mockingbird');
	});

	it('deletes with a 204 and no body', async () => {
		const token = await signIn();
		const res = await request(app)
			.delete('/api/books/b1')
			.set('authorization', `Bearer ${token}`);
		expect(res.status).toBe(204);
		expect((await request(app).get('/api/books')).body).toHaveLength(14);
	});

	it('puts the fifteen books back on reset', async () => {
		const token = await signIn();
		await request(app).delete('/api/books/b1').set('authorization', `Bearer ${token}`);
		await request(app).post('/api/reset');
		expect((await request(app).get('/api/books')).body).toHaveLength(15);
	});
});

describe('the lab knobs', () => {
	it('fails on purpose when asked, with a hint', async () => {
		const res = await request(app).get('/api/books?fail=503');
		expect(res.status).toBe(503);
		expect(res.body.hint).toMatch(/drop \?fail=/);
	});

	it('ignores a fail value that is not an error status', async () => {
		expect((await request(app).get('/api/books?fail=200')).status).toBe(200);
	});

	it('actually waits when asked to', async () => {
		const started = Date.now();
		await request(app).get('/api/books?delay=300');
		expect(Date.now() - started).toBeGreaterThanOrEqual(250);
	});
});
