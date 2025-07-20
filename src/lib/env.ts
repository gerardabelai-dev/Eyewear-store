// Simple environment configuration that prevents server-only code from running on client
import { z } from "zod/v4";

// Client-side environment validation (safe for browser)
const clientEnvSchema = z.object({
	NEXT_PUBLIC_APP_URL: z.string().url("Invalid NEXT_PUBLIC_APP_URL"),
	NEXT_PUBLIC_STACK_PROJECT_ID: z
		.string()
		.min(1, "NEXT_PUBLIC_STACK_PROJECT_ID is required"),
	NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z
		.string()
		.min(1, "NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY is required"),
});

// Always validate client environment (safe on both client and server)
export const clientEnv = clientEnvSchema.parse({
	NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
	NEXT_PUBLIC_STACK_PROJECT_ID: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
	NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY:
		process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
});

// Server environment - only load on server side
let serverEnv: any = null;

if (typeof window === "undefined") {
	// We're on the server, safe to load dotenv and server config
	try {
		// Dynamic import to avoid loading dotenv on client
		const { config } = require("dotenv");

		// Load environment variables from .env.local in development
		if (process.env.NODE_ENV !== "production") {
			config({ path: ".env.local" });
		}

		// Server-side environment validation
		const serverEnvSchema = z.object({
			// Next.js Configuration
			NODE_ENV: z
				.enum(["development", "production", "test"])
				.default("development"),
			NEXT_PUBLIC_APP_URL: z.string().url("Invalid NEXT_PUBLIC_APP_URL"),

			// Database Configuration
			DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

			// Better Auth Configuration
			BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
			BETTER_AUTH_URL: z.string().url("Invalid BETTER_AUTH_URL"),

			// Google OAuth Configuration
			GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
			GOOGLE_CLIENT_SECRET: z
				.string()
				.min(1, "GOOGLE_CLIENT_SECRET is required"),

			// QStash Configuration
			QSTASH_CURRENT_SIGNING_KEY: z
				.string()
				.min(1, "QSTASH_CURRENT_SIGNING_KEY is required"),
			QSTASH_NEXT_SIGNING_KEY: z
				.string()
				.min(1, "QSTASH_NEXT_SIGNING_KEY is required"),
			QSTASH_TOKEN: z.string().min(1, "QSTASH_TOKEN is required"),
			QSTASH_URL: z.string().url("Invalid QSTASH_URL"),

			// Resend Configuration
			RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),

			// Vercel Blob Configuration
			BLOB_READ_WRITE_TOKEN: z
				.string()
				.min(1, "BLOB_READ_WRITE_TOKEN is required"),

			// Admin Configuration
			BACKOFFICE_TOKEN: z.string().min(1, "BACKOFFICE_TOKEN is required"),

			// Stack Auth Configuration
			STACK_SECRET_SERVER_KEY: z
				.string()
				.min(1, "STACK_SECRET_SERVER_KEY is required"),
		});

		serverEnv = serverEnvSchema.parse(process.env);
	} catch (error) {
		console.error("Failed to load server environment:", error);
		throw new Error(
			"Server environment validation failed. Please check your .env.local file.",
		);
	}
}

// Export server environment (will be null on client)
export { serverEnv };

// Export types
export type ClientEnv = typeof clientEnv;
export type ServerEnv = typeof serverEnv;
