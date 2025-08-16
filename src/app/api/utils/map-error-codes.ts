import { ERROR_CODES, ERROR_MESSAGES } from "../contants/error-codes";

export function mapErrorCodes(errorCode: keyof typeof ERROR_CODES) {
	return {
		code: ERROR_CODES[errorCode],
		message: ERROR_MESSAGES[errorCode],
	};
}
