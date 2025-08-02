import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { auth } from "../src/lib/auth";
import * as schema from "../src/lib/db/schema";

// Create database connection for seeding
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is required");
}
const seedSql = neon(databaseUrl);
const seedDb = drizzle(seedSql, { schema });

async function clearDatabase() {
	console.log("🗑️  Clearing existing data...");

	// Clear tables in correct order (respecting foreign key constraints)
	await seedDb.delete(schema.session);
	await seedDb.delete(schema.account);
	await seedDb.delete(schema.verification);
	await seedDb.delete(schema.user);

	console.log("✅ Database cleared successfully");
}

async function seedUsers() {
	console.log("👤 Creating admin user...");

	try {
		// Create admin user using better-auth to ensure proper password hashing
		const adminUser = await auth.api.signUpEmail({
			body: {
				email: "admin@example.com",
				password: "@Admin1234",
				name: "Admin User",
			},
		});

		if (!adminUser.user) {
			throw new Error("Failed to create admin user");
		}

		console.log("✅ Admin user created successfully:", {
			id: adminUser.user.id,
			email: adminUser.user.email,
			name: adminUser.user.name,
		});

		return adminUser.user;
	} catch (error) {
		console.error("❌ Error creating admin user:", error);
		throw error;
	}
}

async function seedSessions(userId: string) {
	console.log("🔐 Creating sample session...");

	// Create a sample session (this would normally be done by better-auth during login)
	const sessionData = {
		id: `session_${Date.now()}`,
		userId,
		token: `token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
		expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
		ipAddress: "127.0.0.1",
		userAgent: "Mozilla/5.0 (Seeding Script)",
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	await seedDb.insert(schema.session).values(sessionData);

	console.log("✅ Sample session created successfully:", {
		id: sessionData.id,
		userId: sessionData.userId,
		expiresAt: sessionData.expiresAt,
	});

	return sessionData;
}

async function seedAccounts(userId: string) {
	console.log("🔗 Creating sample account...");

	// Create a sample account record (for credential-based auth)
	const accountData = {
		id: `account_${Date.now()}`,
		accountId: userId,
		providerId: "credential",
		userId,
		password: null, // Password is handled by better-auth
		scope: "email profile",
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	await seedDb.insert(schema.account).values(accountData);

	console.log("✅ Sample account created successfully:", {
		id: accountData.id,
		providerId: accountData.providerId,
		userId: accountData.userId,
	});

	return accountData;
}

async function seedVerifications() {
	console.log("✉️  Creating sample verification...");

	// Create a sample verification record
	const verificationData = {
		id: `verification_${Date.now()}`,
		identifier: "admin@example.com",
		value: `verification_code_${Math.random().toString(36).substring(2)}`,
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	await seedDb.insert(schema.verification).values(verificationData);

	console.log("✅ Sample verification created successfully:", {
		id: verificationData.id,
		identifier: verificationData.identifier,
		expiresAt: verificationData.expiresAt,
	});

	return verificationData;
}

async function seed() {
	try {
		console.log("🌱 Starting database seeding...");
		console.log(
			"📊 Database URL:",
			`${process.env.DATABASE_URL?.substring(0, 50)}...`,
		);

		// Test database connection
		await seedDb.execute(sql`SELECT 1`);
		console.log("✅ Database connection successful");

		// Clear existing data
		await clearDatabase();

		// Seed data in correct order
		const user = await seedUsers();
		await seedSessions(user.id);
		await seedAccounts(user.id);
		await seedVerifications();

		console.log("\n🎉 Database seeding completed successfully!");
		console.log("\n📋 Summary:");
		console.log(`   👤 Users: 1 (admin@example.com)`);
		console.log(`   🔐 Sessions: 1`);
		console.log(`   🔗 Accounts: 1`);
		console.log(`   ✉️  Verifications: 1`);
		console.log("\n🔑 Login credentials:");
		console.log(`   Email: admin@example.com`);
		console.log(`   Password: @Admin1234`);

		process.exit(0);
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	}
}

// Run the seeding
seed();
