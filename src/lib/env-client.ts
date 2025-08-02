import { z } from "zod";

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

// Export types
export type ClientEnv = typeof clientEnv;
