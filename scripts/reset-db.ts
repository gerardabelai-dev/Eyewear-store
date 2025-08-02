import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

// Create database connection for resetting
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is required");
}
const resetSql = neon(databaseUrl);
const resetDb = drizzle(resetSql);

async function resetDatabase() {
	try {
		console.log("🗑️  Resetting database structure...");
		console.log(
			"📊 Database URL:",
			`${process.env.DATABASE_URL?.substring(0, 50)}...`,
		);

		// Test database connection
		await resetDb.execute(sql`SELECT 1`);
		console.log("✅ Database connection successful");

		// Drop all tables in the correct order (respecting foreign key constraints)
		console.log("🔥 Dropping existing tables...");

		// Drop tables that reference other tables first
		await resetDb.execute(sql`DROP TABLE IF EXISTS "session" CASCADE`);
		console.log("   ✅ Dropped session table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "account" CASCADE`);
		console.log("   ✅ Dropped account table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "verification" CASCADE`);
		console.log("   ✅ Dropped verification table");

		// Drop the main user table last
		await resetDb.execute(sql`DROP TABLE IF EXISTS "user" CASCADE`);
		console.log("   ✅ Dropped user table");

		// Drop any potential drizzle meta tables
		await resetDb.execute(
			sql`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE`,
		);
		console.log("   ✅ Dropped drizzle migrations table");

		console.log("\n🎉 Database structure reset successfully!");
		console.log("📝 You can now run migrations and seeding:");
		console.log("   pnpm db:migrate");
		console.log("   pnpm db:seed");

		process.exit(0);
	} catch (error) {
		console.error("❌ Database reset failed:", error);
		process.exit(1);
	}
}

// Run the reset
resetDatabase();
