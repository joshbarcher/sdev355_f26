/**
 * The knobs that let this API misbehave on purpose.
 *
 * WHY THIS FILE EXISTS
 *
 * A loading spinner you cannot see is a loading spinner nobody believes in.
 * On localhost every request comes back in two milliseconds, so week 4's
 * `loading` state flashes past and the error branch never runs at all -- and a
 * deck ends up teaching error handling against a thing that has never once
 * happened on screen. That is the same defect as writing slides from an app
 * that does not exist, one level down.
 *
 * So slowness and failure are first-class features here, asked for in the URL:
 *
 *     GET /api/books?delay=2000     take two seconds to answer
 *     GET /api/books?fail=500       answer 500, with a JSON error body
 *     GET /api/books?fail=404       any status works, so does 401 or 503
 *
 * In the URL rather than hidden in a config file because it is visible: it
 * shows up in the DevTools network tab, in the slide's code sample, and in the
 * student's own address bar. Nothing is secretly on.
 *
 * SHELF_DELAY_MS=400 in the environment adds a floor to every request, which is
 * the honest setting for a whole session -- it makes localhost feel like a
 * network without any deck having to ask for it.
 */

const FLOOR_MS = Number(process.env.SHELF_DELAY_MS) || 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function lab(req, res, next) {
	const asked = Number(req.query.delay) || 0;
	// Capped. A typo of 100000 should not wedge the class for two minutes.
	const wait = Math.min(Math.max(asked, FLOOR_MS), 10_000);
	if (wait > 0) await sleep(wait);

	const fail = Number(req.query.fail);
	if (Number.isInteger(fail) && fail >= 400 && fail <= 599) {
		return res.status(fail).json({
			error: `deliberate ${fail}, because the request asked for one`,
			hint: 'drop ?fail= from the URL and this succeeds'
		});
	}

	next();
}
