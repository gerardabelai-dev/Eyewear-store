import { type NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/lib/api-response";

export function middleware(request: NextRequest) {
	// Only apply to API routes
	if (request.nextUrl.pathname.startsWith("/api/")) {
		try {
			// Set headers to ensure JSON responses
			const requestHeaders = new Headers(request.headers);

			// Ensure Accept header includes JSON
			if (!requestHeaders.get("Accept")?.includes("application/json")) {
				requestHeaders.set("Accept", "application/json, */*");
			}

			// Ensure Content-Type is set for POST/PUT/PATCH requests
			const method = request.method;
			if (["POST", "PUT", "PATCH"].includes(method)) {
				if (!requestHeaders.get("Content-Type")) {
					requestHeaders.set("Content-Type", "application/json");
				}
			}

			// Continue with the request
			const response = NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			});

			// Add CORS headers for API routes
			response.headers.set("Access-Control-Allow-Origin", "*");
			response.headers.set(
				"Access-Control-Allow-Methods",
				"GET, POST, PUT, DELETE, OPTIONS",
			);
			response.headers.set(
				"Access-Control-Allow-Headers",
				"Content-Type, Authorization",
			);

			return response;
		} catch (error) {
			// Catch any middleware errors and return JSON
			console.error("Middleware error:", error);
			return createErrorResponse("Request processing error", 500);
		}
	}

	// Handle preflight requests
	if (request.method === "OPTIONS") {
		return new NextResponse(null, {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		});
	}

	// For non-API routes, continue normally
	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
