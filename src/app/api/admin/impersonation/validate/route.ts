import type { NextRequest } from "next/server";
import { z } from "zod";
import {
	createAuthErrorResponse,
	createSuccessResponse,
	withErrorHandling,
} from "@/lib/api-response";
import { consumeImpersonationToken } from "@/lib/impersonation";

const validateImpersonationSchema = z.object({
	impersonationToken: z.string().min(1, "Impersonation token is required"),
	sessionToken: z.string().min(1, "Session token is required"),
});

async function handleValidation(request: NextRequest) {
	// Parse and validate request body
	const body = await request.json();
	const { impersonationToken, sessionToken } =
		validateImpersonationSchema.parse(body);

	// Validate and consume the impersonation token
	const impersonationData = consumeImpersonationToken(impersonationToken);

	if (!impersonationData) {
		throw new Error("Invalid or expired impersonation token");
	}

	// Verify the session token matches
	if (impersonationData.sessionToken !== sessionToken) {
		throw new Error("Session token mismatch");
	}

	// Return success with user info from impersonation data (token is consumed after validation)
	return createSuccessResponse({
		user: {
			id: impersonationData.userId,
			email: impersonationData.userEmail,
			name: impersonationData.userName,
		},
		message: "Impersonation validated successfully",
	});
}

export const POST = withErrorHandling(handleValidation);
