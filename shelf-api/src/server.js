import { createApp } from './app.js';

/**
 * The only file that listens.
 *
 * 4000 because the course already says 4000. `w10.2` has
 * `const BASE = "http://localhost:4000"` on a slide and calls it "a constant
 * since Week 4", so this is not a free choice -- the decks picked it first.
 */
const port = Number(process.env.PORT) || 4000;

const server = createApp().listen(port, () => {
	console.log(`shelf-api  ->  http://localhost:${port}`);
	console.log('');
	console.log('  books      GET  http://localhost:' + port + '/api/books');
	console.log('  sign in    POST http://localhost:' + port + '/api/auth/login');
	console.log('             { "email": "josh@example.com", "password": "password123" }');
	console.log('  slow it    GET  http://localhost:' + port + '/api/books?delay=2000');
	console.log('  break it   GET  http://localhost:' + port + '/api/books?fail=500');
	console.log('  start over POST http://localhost:' + port + '/api/reset');
	console.log('');
	console.log('Data lives in memory. Stopping this server forgets every change.');
});

// Ctrl-C should end the process, not leave the port held by something invisible
// that the next `npm run dev` then fails to bind. `node --watch` restarts often.
for (const signal of ['SIGTERM', 'SIGINT']) {
	process.on(signal, () => {
		server.close(() => process.exit(0));
	});
}
