import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export const securityHeadersMiddleware = helmet({
	crossOriginResourcePolicy: { policy: "cross-origin" },
});

export const apiRateLimitMiddleware = rateLimit({
	windowMs: RATE_LIMIT_WINDOW_MS,
	max: 600,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	skip: (req) => req.path === "/health",
	message: {
		message: "Too many requests, please try again later.",
	},
});

export const authRateLimitMiddleware = rateLimit({
	windowMs: RATE_LIMIT_WINDOW_MS,
	max: 50,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: {
		message: "Too many authentication attempts, please try again later.",
	},
});
