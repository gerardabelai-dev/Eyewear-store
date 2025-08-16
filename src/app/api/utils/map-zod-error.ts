import type { ZodError } from "zod";

export function mapZodError(error: ZodError) {
	return {
		message: error.message,
		errors: error.issues.map((issue) => issue.message),
	};
}
