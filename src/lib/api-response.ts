import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Standard API response format
export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	details?: any;
	code?: string;
	timestamp: string;
}

// Standard error codes
export const ErrorCodes = {
	VALIDATION_ERROR: "VALIDATION_ERROR",
	AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
	AUTHORIZATION_FAILED: "AUTHORIZATION_FAILED",
	NOT_FOUND: "NOT_FOUND",
	INTERNAL_ERROR: "INTERNAL_ERROR",
	RATE_LIMITED: "RATE_LIMITED",
	INVALID_REQUEST: "INVALID_REQUEST",
	SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

// Success response helper
export function createSuccessResponse<T>(
	data: T,
	message?: string,
): NextResponse<ApiResponse<T>> {
	return NextResponse.json({
		success: true,
		data,
		...(message && { message }),
		timestamp: new Date().toISOString(),
	});
}

// Error response helper
export function createErrorResponse(
	error: string,
	status: number = 500,
	code?: string,
	details?: any,
): NextResponse<ApiResponse> {
	return NextResponse.json(
		{
			success: false,
			error,
			...(code && { code }),
			...(details && { details }),
			timestamp: new Date().toISOString(),
		},
		{ status },
	);
}

// Validation error helper
export function createValidationErrorResponse(
	zodError: ZodError,
): NextResponse<ApiResponse> {
	return createErrorResponse(
		"Dados de entrada inválidos",
		400,
		ErrorCodes.VALIDATION_ERROR,
		zodError.errors,
	);
}

// Authentication error helper
export function createAuthErrorResponse(
	message: string = "Autenticação necessária",
): NextResponse<ApiResponse> {
	return createErrorResponse(message, 401, ErrorCodes.AUTHENTICATION_REQUIRED);
}

// Authorization error helper
export function createAuthorizationErrorResponse(
	message: string = "Acesso negado",
): NextResponse<ApiResponse> {
	return createErrorResponse(message, 403, ErrorCodes.AUTHORIZATION_FAILED);
}

// Not found error helper
export function createNotFoundResponse(
	resource: string = "Recurso",
): NextResponse<ApiResponse> {
	return createErrorResponse(
		`${resource} não encontrado`,
		404,
		ErrorCodes.NOT_FOUND,
	);
}

// Rate limit error helper
export function createRateLimitResponse(): NextResponse<ApiResponse> {
	return createErrorResponse(
		"Muitas tentativas. Tente novamente mais tarde",
		429,
		ErrorCodes.RATE_LIMITED,
	);
}

// Generic error handler for API routes
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
	console.error("API Error:", error);

	// Handle Zod validation errors
	if (error instanceof ZodError) {
		return createValidationErrorResponse(error);
	}

	// Handle known error types
	if (error instanceof Error) {
		// Check for specific error messages/types
		if (
			error.message.includes("unauthorized") ||
			error.message.includes("authentication")
		) {
			return createAuthErrorResponse(error.message);
		}

		if (
			error.message.includes("forbidden") ||
			error.message.includes("authorization")
		) {
			return createAuthorizationErrorResponse(error.message);
		}

		if (error.message.includes("not found")) {
			return createNotFoundResponse();
		}

		// Generic error with message
		return createErrorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR);
	}

	// Fallback for unknown errors
	return createErrorResponse(
		"Erro interno do servidor",
		500,
		ErrorCodes.INTERNAL_ERROR,
	);
}

// Wrapper for API route handlers with automatic error handling
export function withErrorHandling(
	handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
) {
	return async (request: NextRequest, context?: any): Promise<NextResponse> => {
		try {
			return await handler(request, context);
		} catch (error) {
			return handleApiError(error);
		}
	};
}

// Async wrapper that ensures JSON responses
export function withJsonResponse(
	handler: (request: NextRequest, context?: any) => Promise<any>,
) {
	return withErrorHandling(async (request: NextRequest, context?: any) => {
		const result = await handler(request, context);

		// If result is already a NextResponse, return it
		if (result instanceof NextResponse) {
			return result;
		}

		// Otherwise wrap in success response
		return createSuccessResponse(result);
	});
}
