import { config } from "dotenv";

// Load environment variables from .env.local first, then .env
config({ path: ".env.local" });
config();

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

		// Drop business tables that reference other tables first
		await resetDb.execute(sql`DROP TABLE IF EXISTS "orderProduct" CASCADE`);
		console.log("   ✅ Dropped orderProduct table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "orderDelivery" CASCADE`);
		console.log("   ✅ Dropped orderDelivery table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "orderPayment" CASCADE`);
		console.log("   ✅ Dropped orderPayment table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "productImage" CASCADE`);
		console.log("   ✅ Dropped productImage table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "productPrice" CASCADE`);
		console.log("   ✅ Dropped productPrice table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "order" CASCADE`);
		console.log("   ✅ Dropped order table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "customerAddress" CASCADE`);
		console.log("   ✅ Dropped customerAddress table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "customer" CASCADE`);
		console.log("   ✅ Dropped customer table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "product" CASCADE`);
		console.log("   ✅ Dropped product table");

		await resetDb.execute(
			sql`DROP TABLE IF EXISTS "categorySecondary" CASCADE`,
		);
		console.log("   ✅ Dropped categorySecondary table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "category" CASCADE`);
		console.log("   ✅ Dropped category table");

		await resetDb.execute(sql`DROP TABLE IF EXISTS "activity" CASCADE`);
		console.log("   ✅ Dropped activity table");

		// Drop auth tables that reference other tables
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

		// Drop enums to prevent migration conflicts
		console.log("🔥 Dropping existing enums...");
		await resetDb.execute(sql`DROP TYPE IF EXISTS "customerRole" CASCADE`);
		console.log("   ✅ Dropped customerRole enum");

		await resetDb.execute(
			sql`DROP TYPE IF EXISTS "orderDeliveryStatus" CASCADE`,
		);
		console.log("   ✅ Dropped orderDeliveryStatus enum");

		await resetDb.execute(
			sql`DROP TYPE IF EXISTS "orderPaymentStatus" CASCADE`,
		);
		console.log("   ✅ Dropped orderPaymentStatus enum");

		await resetDb.execute(sql`DROP TYPE IF EXISTS "productStatus" CASCADE`);
		console.log("   ✅ Dropped productStatus enum");

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
