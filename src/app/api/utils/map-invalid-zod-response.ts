import type { ZodError } from "zod";
import { HTTP_CODES } from "../contants/http-codes";
import { mapZodError } from "./map-zod-error";

export function mapInvalidZodResponse(error: ZodError) {
	console.error(error);
	return Response.json(mapZodError(error), {
		status: HTTP_CODES.BAD_REQUEST,
	});
}
