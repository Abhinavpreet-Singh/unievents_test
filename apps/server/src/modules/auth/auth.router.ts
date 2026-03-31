import {
	authSessionIdParamSchema,
	loginSchema,
	logoutSchema,
	refreshSessionSchema,
	registerSchema,
} from "@voltaze/schema";
import { Router } from "express";

import { requireAuth } from "@/common/middlewares/auth.middleware";
import { authRateLimitMiddleware } from "@/common/middlewares/security.middleware";
import { validatePipe } from "@/common/pipes/validate.pipe";
import { asyncHandler } from "@/common/utils/async-handler";

import { authController } from "./auth.controller";

export function createAuthRouter(): Router {
	const router = Router();

	router.get(
		"/me",
		requireAuth,
		asyncHandler((req, res) => authController.me(req, res)),
	);
	router.post(
		"/register",
		authRateLimitMiddleware,
		validatePipe({ body: registerSchema }),
		asyncHandler((req, res) => authController.register(req, res)),
	);
	router.post(
		"/login",
		authRateLimitMiddleware,
		validatePipe({ body: loginSchema }),
		asyncHandler((req, res) => authController.login(req, res)),
	);
	router.post(
		"/refresh",
		authRateLimitMiddleware,
		validatePipe({ body: refreshSessionSchema }),
		asyncHandler((req, res) => authController.refresh(req, res)),
	);
	router.post(
		"/logout",
		authRateLimitMiddleware,
		validatePipe({ body: logoutSchema }),
		asyncHandler((req, res) => authController.logout(req, res)),
	);
	router.post(
		"/logout-all",
		requireAuth,
		asyncHandler((req, res) => authController.logoutAll(req, res)),
	);
	router.get(
		"/sessions",
		requireAuth,
		asyncHandler((req, res) => authController.sessions(req, res)),
	);
	router.delete(
		"/sessions/:sessionId",
		requireAuth,
		validatePipe({ params: authSessionIdParamSchema }),
		asyncHandler((req, res) => authController.revokeSession(req, res)),
	);

	return router;
}
