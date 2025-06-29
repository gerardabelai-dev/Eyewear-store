import { config } from "dotenv";
import { z } from "zod/v4";

// Load environment variables from .env.local in development
if (process.env.NODE_ENV !== "production") {
	config({ path: ".env.local" });
}

// Server-side environment validation (only runs on server)
const serverEnvSchema = z.object({
	// Next.js Configuration
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	NEXT_PUBLIC_APP_URL: z.url("Invalid NEXT_PUBLIC_APP_URL"),

	// Neon Database Configuration (server-only)
	DATABASE_URL: z
		.string()
		.min(1, "DATABASE_URL is required")
		.startsWith(
			"postgres://",
			"DATABASE_URL must be a valid PostgreSQL connection string",
		),

	// Better Auth Configuration (server-only)
	BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
	BETTER_AUTH_URL: z.url("Invalid BETTER_AUTH_URL"),

	// Google OAuth Configuration (server-only)
	GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
	GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

	// Optional Neon Database Variables
	DATABASE_URL_UNPOOLED: z.string().optional(),
	PGHOST: z.string().optional(),
	PGHOST_UNPOOLED: z.string().optional(),
	PGUSER: z.string().optional(),
	PGDATABASE: z.string().optional(),
	PGPASSWORD: z.string().optional(),
	POSTGRES_URL: z.string().optional(),
	POSTGRES_URL_NON_POOLING: z.string().optional(),
	POSTGRES_USER: z.string().optional(),
	POSTGRES_HOST: z.string().optional(),
	POSTGRES_PASSWORD: z.string().optional(),
	POSTGRES_DATABASE: z.string().optional(),
	POSTGRES_URL_NO_SSL: z.string().optional(),
	POSTGRES_PRISMA_URL: z.string().optional(),
});

// Client-side environment validation (only public variables)
const clientEnvSchema = z.object({
	NEXT_PUBLIC_APP_URL: z.url("Invalid NEXT_PUBLIC_APP_URL"),
});

// Server-side environment validation
function validateServerEnv() {
	try {
		return serverEnvSchema.parse(process.env);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const missingVars = error.issues
				.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
				.join("\n");

			throw new Error(
				`❌ Server environment validation failed:\n\n${missingVars}\n\nPlease check your .env.local file and ensure all required variables are set.`,
			);
		}
		throw error;
	}
}

// Client-side environment validation
function validateClientEnv() {
	try {
		return clientEnvSchema.parse({
			NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			const missingVars = error.issues
				.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
				.join("\n");

			throw new Error(
				`❌ Client environment validation failed:\n\n${missingVars}\n\nPlease check your .env.local file and ensure all required variables are set.`,
			);
		}
		throw error;
	}
}

// Export validated environments
export const serverEnv =
	typeof window === "undefined"
		? validateServerEnv()
		: ({} as z.infer<typeof serverEnvSchema>);
export const clientEnv = validateClientEnv();

// For backward compatibility, expose the appropriate env based on context
// Note: Use serverEnv directly in server-only files (like drizzle.config.ts)
export const env =
	typeof window === "undefined"
		? (serverEnv as unknown as typeof clientEnv)
		: (clientEnv as unknown as typeof serverEnv);

// Type exports for TypeScript support
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
