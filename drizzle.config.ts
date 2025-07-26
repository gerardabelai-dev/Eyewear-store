import "server-only";
import { defineConfig } from "drizzle-kit";
import { serverEnv } from "./src/lib/env";

export default defineConfig({
	schema: "./src/lib/db/schema.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: serverEnv.DATABASE_URL,
	},
	verbose: true,
	strict: true,
});
