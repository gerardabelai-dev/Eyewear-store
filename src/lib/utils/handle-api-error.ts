/**
 * Handles API error responses by extracting the error message from the response
 * @param response - The fetch response object
 * @param fallbackError - The fallback error code to use if parsing fails
 * @returns Promise that throws an error with the backend message or fallback
 */
export async function handleApiError(
	response: Response,
	fallbackError: string,
): Promise<never> {
	try {
		const errorData = await response.json();
		// Use the backend message if available, otherwise use the code
		const errorMessage = errorData.message || errorData.code || fallbackError;
		throw new Error(errorMessage);
	} catch (error) {
		// If parsing fails or error is already thrown, use it or fallback
		if (error instanceof Error) {
			throw error;
		}
		throw new Error(fallbackError);
	}
}
