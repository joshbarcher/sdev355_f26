import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';

/**
 * Sign-in, tokens, and the one middleware that guards a route.
 *
 * This is the file week 9 is taught against. It is deliberately small enough
 * to read in one sitting, because "what is actually in a JWT" is the lesson,
 * and an answer a student cannot open and look at is not an answer.
 */

/**
 * A secret that is a constant in a file everyone can read is not a secret.
 *
 * It is fine HERE and nowhere else: this server runs on the student's own
 * laptop, serves only them, and holds five books about software. The moment an
 * API like this is deployed, this value comes from the environment and the
 * fallback is deleted. Week 10 makes exactly that point about VITE_API_URL.
 */
const SECRET = process.env.SHELF_JWT_SECRET || 'shelf-dev-secret-not-for-deployment';

const TOKEN_TTL = '2h';

/**
 * scrypt, from node's own crypto module -- no dependency, and it is what you
 * would reach for anyway.
 *
 * The salt is per-user and stored next to the hash. It is not secret; its job
 * is to make sure two people who picked the same password do not end up with
 * the same hash, which is what makes a stolen password file worth stealing.
 */
function hashPassword(password, salt = randomBytes(16).toString('hex')) {
	return { salt, hash: scryptSync(password, salt, 64).toString('hex') };
}

function verifyPassword(password, { salt, hash }) {
	const attempt = scryptSync(password, salt, 64);
	const known = Buffer.from(hash, 'hex');
	// timingSafeEqual, not ===. A plain comparison returns faster the earlier
	// it finds a difference, and that timing leaks the hash one byte at a time.
	return attempt.length === known.length && timingSafeEqual(attempt, known);
}

/**
 * Two accounts, both with the password printed in the README.
 *
 * A demo API with a login screen and no way in is a demo API nobody can use.
 * Two rather than one so week 9 can show that your shelf is yours: sign in as
 * the other account and the same endpoints answer with a different name.
 */
const USERS = [
	{ id: 'u1', email: 'josh@example.com', name: 'Josh', password: 'password123' },
	{ id: 'u2', email: 'student@example.com', name: 'Student', password: 'password123' }
].map(({ password, ...user }) => ({ ...user, ...hashPassword(password) }));

/** What the API is willing to say about a user. Never the hash, never the salt. */
function publicUser(user) {
	return { id: user.id, email: user.email, name: user.name };
}

export function signIn(email, password) {
	const user = USERS.find((u) => u.email === String(email).toLowerCase().trim());

	// One message for "no such email" and for "wrong password", on purpose.
	// Telling them apart tells an attacker which addresses have accounts here.
	if (!user || !verifyPassword(String(password), user)) return undefined;

	const token = jwt.sign({ sub: user.id, name: user.name }, SECRET, { expiresIn: TOKEN_TTL });
	return { token, user: publicUser(user) };
}

/**
 * Guards a route. On success `req.user` is set; otherwise nothing downstream
 * runs at all.
 *
 * 401 means "I do not know who you are" -- which is the status week 9's
 * protected routes hang off, so it has to be exactly right. A missing header
 * and an expired token are both 401; neither is 403, which would mean "I know
 * who you are and you still may not."
 */
export function requireAuth(req, res, next) {
	const header = req.get('authorization') ?? '';
	const [scheme, token] = header.split(' ');

	if (scheme !== 'Bearer' || !token) {
		return res.status(401).json({ error: 'missing bearer token' });
	}

	try {
		const payload = jwt.verify(token, SECRET);
		req.user = { id: payload.sub, name: payload.name };
		next();
	} catch {
		// jwt.verify throws for a bad signature AND for an expired token. The
		// client cannot tell them apart and does not need to: both mean sign in.
		return res.status(401).json({ error: 'invalid or expired token' });
	}
}

export { publicUser };
