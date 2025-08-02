import "server-only";
import { z } from "zod";

// Re-export client env for convenience
export { type ClientEnv, clientEnv } from "./env-client";

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
	GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

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
	BLOB_READ_WRITE_TOKEN: z.string().min(1, "BLOB_READ_WRITE_TOKEN is required"),

	// Admin Configuration
	BACKOFFICE_TOKEN: z.string().min(1, "BACKOFFICE_TOKEN is required"),

	// Stack Auth Configuration
	STACK_SECRET_SERVER_KEY: z
		.string()
		.min(1, "STACK_SECRET_SERVER_KEY is required"),
});

export const serverEnv = serverEnvSchema.parse(process.env);

// Export types
export type ServerEnv = typeof serverEnv;
