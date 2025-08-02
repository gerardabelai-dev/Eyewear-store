import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .env.local (for development)
dotenv.config({ path: [".env.local", ".env"] });

export default defineConfig({
	schema: "./src/lib/db/schema.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
});
