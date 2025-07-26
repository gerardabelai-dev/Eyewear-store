import "server-only";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	createErrorResponse,
	createSuccessResponse,
	withErrorHandling,
} from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { account, session, user, verification } from "@/lib/db/schema";
import { serverEnv } from "@/lib/env";
import { storeImpersonationToken } from "@/lib/impersonation";

const impersonationSchema = z.object({
	email: z.string().email("Invalid email format"),
});

async function handleImpersonation(request: NextRequest) {
	// Check authorization header for BACKOFFICE_TOKEN
	const authHeader = request.headers.get("authorization");
	const token = authHeader?.replace("Bearer ", "");

	if (!token || token !== serverEnv.BACKOFFICE_TOKEN) {
		throw new Error("unauthorized");
	}

	// Parse and validate request body
	const body = await request.json();
	const { email } = impersonationSchema.parse(body);

	// Check if user exists (with type assertion to work around drizzle version conflicts)
	const targetUser = await (db as any)
		.select()
		.from(user)
		.where(eq(user.email, email))
		.limit(1);

	if (!targetUser.length) {
		return createErrorResponse("Usuário");
	}

	// Type assertion to work around drizzle version conflicts
	const userData = targetUser[0] as any;

	// Generate impersonation token (valid for 5 minutes)
	const impersonationToken = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

	// Generate a session token manually (since Better Auth createSession may not be available)
	const sessionToken = crypto.randomUUID();

	// Store the impersonation token temporarily
	storeImpersonationToken(impersonationToken, {
		userId: userData.id,
		userEmail: userData.email,
		userName: userData.name,
		sessionToken,
		expiresAt,
	});

	// Generate impersonation URL
	const impersonationUrl = `${serverEnv.NEXT_PUBLIC_APP_URL}/auth?impersonationToken=${impersonationToken}&sessionToken=${sessionToken}`;

	return createSuccessResponse({
		impersonationUrl,
		accessToken: sessionToken,
		expiresAt: expiresAt.toISOString(),
		user: {
			id: userData.id,
			email: userData.email,
			name: userData.name,
		},
	});
}

async function handleHealthCheck(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	const token = authHeader?.replace("Bearer ", "");

	if (!token || token !== serverEnv.BACKOFFICE_TOKEN) {
		throw new Error("unauthorized");
	}

	return createSuccessResponse({
		message: "Admin impersonation endpoint is active",
		timestamp: new Date().toISOString(),
	});
}

// Export handlers with error handling
export const POST = withErrorHandling(handleImpersonation);
export const GET = withErrorHandling(handleHealthCheck);
