const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

interface RateLimitStore {
	[ip: string]: {
		count: number;
		resetTime: number;
	};
}

const store: RateLimitStore = {};

export function rateLimit(req: Request): boolean {
	const ip = new URL(req.url).hostname;
	const now = Date.now();

	if (!store[ip]) {
		store[ip] = {
			count: 1,
			resetTime: now + WINDOW_MS,
		};
		return true;
	}

	if (now > store[ip].resetTime) {
		store[ip] = {
			count: 1,
			resetTime: now + WINDOW_MS,
		};
		return true;
	}

	if (store[ip].count >= MAX_REQUESTS) {
		return false;
	}

	store[ip].count++;
	return true;
}
