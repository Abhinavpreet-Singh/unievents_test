import type { RequestHandler } from "express";

type ValidationSchemas = {
	body?: { parse: (input: unknown) => unknown };
	query?: { parse: (input: unknown) => unknown };
	params?: { parse: (input: unknown) => unknown };
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function replaceQueryValue(targetQuery: unknown, parsedQuery: unknown): void {
	if (!isRecord(targetQuery) || !isRecord(parsedQuery)) {
		return;
	}

	for (const key of Object.keys(targetQuery)) {
		delete targetQuery[key];
	}

	Object.assign(targetQuery, parsedQuery);
}

export function validatePipe(schemas: ValidationSchemas): RequestHandler {
	return (req, _res, next) => {
		if (schemas.body) {
			req.body = schemas.body.parse(req.body) as never;
		}

		if (schemas.query) {
			const parsedQuery = schemas.query.parse(req.query);
			replaceQueryValue(req.query, parsedQuery);
		}

		if (schemas.params) {
			req.params = schemas.params.parse(req.params) as never;
		}

		next();
	};
}
