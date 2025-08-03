import { z } from "zod";

const schema = z.object({
	// Next.js Configuration
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	WEB_URL: z.string().url("Invalid WEB_URL"),

	// Database Configuration
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

	// Better Auth Configuration
	BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
	BETTER_AUTH_URL: z.string().url("Invalid BETTER_AUTH_URL"),

	// Google OAuth Configuration
	GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
	GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

	// Resend Configuration
	RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
});

export const env = schema.parse(process.env);
