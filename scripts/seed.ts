import { config } from "dotenv";

// Load environment variables from .env.local first, then .env
config({ path: ".env.local" });
config();

import { createHash } from "node:crypto";
import { faker } from "@faker-js/faker";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { nanoid } from "nanoid";
// Removed auth import due to server-only restriction
// We'll create users directly in the database instead
import * as schema from "../src/lib/db/schema";

// Create database connection for seeding
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is required");
}
const seedSql = neon(databaseUrl);
const seedDb = drizzle(seedSql, { schema });
const _defaultPassword = "12341234";

// Simple password hashing function for seeding
function _hashPassword(password: string): string {
	return createHash("sha256").update(password).digest("hex");
}

async function clearDatabase() {
	console.info("🗑️  Clearing existing data...");

	// Clear better-auth tables in correct order (respecting foreign key constraints)
	await seedDb.delete(schema.session);
	await seedDb.delete(schema.account);
	await seedDb.delete(schema.verification);
	await seedDb.delete(schema.user);

	// Clear ecommerce tables in correct order (respecting foreign key constraints)
	await seedDb.delete(schema.activity);
	await seedDb.delete(schema.orderPayment);
	await seedDb.delete(schema.orderDelivery);
	await seedDb.delete(schema.orderProduct);
	await seedDb.delete(schema.order);
	await seedDb.delete(schema.productPrice);
	await seedDb.delete(schema.productImage);
	await seedDb.delete(schema.product);
	await seedDb.delete(schema.categorySecondary);
	await seedDb.delete(schema.category);
	await seedDb.delete(schema.customerAddress);
	await seedDb.delete(schema.customer);

	console.info("✅ Database cleared successfully");
}

async function seedUsers() {
	console.info("👤 Creating users...");

	try {
		// Create admin user directly in database
		const adminUserId = nanoid();
		const adminUserData = {
			id: adminUserId,
			email: "admin@example.com",
			name: "Admin User",
			emailVerified: true,
			image: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await seedDb.insert(schema.user).values(adminUserData);

		console.info("✅ Admin user created successfully:", {
			id: adminUserData.id,
			email: adminUserData.email,
			name: adminUserData.name,
		});

		// Create customer user directly in database
		const customerUserId = nanoid();
		const customerUserData = {
			id: customerUserId,
			email: "customer@example.com",
			name: "Customer User",
			emailVerified: true,
			image: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await seedDb.insert(schema.user).values(customerUserData);

		console.info("✅ Customer user created successfully:", {
			id: customerUserData.id,
			email: customerUserData.email,
			name: customerUserData.name,
		});

		return [{ user: adminUserData }, { user: customerUserData }];
	} catch (error) {
		console.error("❌ Error creating users:", error);
		throw error;
	}
}

async function seedSessions(userId: string) {
	console.info(`🔐 Creating sample session for user ID: ${userId}...`);

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

	console.info("✅ Sample session created successfully:", {
		sessionId: sessionData.id,
		userId: sessionData.userId,
		expiresAt: sessionData.expiresAt,
	});

	return sessionData;
}

async function seedAccounts(userId: string) {
	console.info(`🔗 Creating sample account for user ID: ${userId}...`);

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

	console.info("✅ Sample account created successfully:", {
		accountId: accountData.id,
		providerId: accountData.providerId,
		userId: accountData.userId,
	});

	return accountData;
}

async function seedVerifications(userEmail: string) {
	console.info(`✉️  Creating sample verification for email: ${userEmail}...`);

	// Create a sample verification record
	const verificationData = {
		id: `verification_${Date.now()}`,
		identifier: userEmail,
		value: `verification_code_${Math.random().toString(36).substring(2)}`,
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	await seedDb.insert(schema.verification).values(verificationData);

	console.info("✅ Sample verification created successfully:", {
		verificationId: verificationData.id,
		identifier: verificationData.identifier,
		expiresAt: verificationData.expiresAt,
	});

	return verificationData;
}

async function seedCustomer(userId: string, role: "admin" | "customer") {
	console.info(
		`👤 Creating customer for user ID: ${userId} with role: ${role}...`,
	);

	const [customer] = await seedDb
		.insert(schema.customer)
		.values({
			userId,
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			role,
		})
		.returning();

	console.info(`✅ Customer created successfully with ID: ${customer.id}`);

	await seedActivity({
		type: "customer.created",
		actorId: customer.id,
		actorType: "customer",
		customerId: customer.id,
	});

	return customer;
}

async function seedCustomerAddress(userId: string) {
	console.info(`🏠 Creating customer address for customer ID: ${userId}...`);

	const [customerAddress] = await seedDb
		.insert(schema.customerAddress)
		.values({
			customerId: userId,
			street: faker.location.streetAddress(),
			number: faker.location.buildingNumber(),
			complement: faker.location.secondaryAddress(),
			neighborhood: faker.location.street(),
			city: faker.location.city(),
			state: faker.location.state(),
			zipCode: faker.location.zipCode(),
			country: faker.location.country(),
			isDefault: true,
		})
		.returning();

	console.info(
		`✅ Primary customer address created successfully with ID: ${customerAddress.id}`,
	);

	await seedActivity({
		type: "customerAddress.created",
		actorId: customerAddress.id,
		actorType: "customerAddress",
		customerId: userId,
	});

	const [secondaryAddress] = await seedDb
		.insert(schema.customerAddress)
		.values({
			customerId: userId,
			street: faker.location.streetAddress(),
			number: faker.location.buildingNumber(),
			complement: faker.location.secondaryAddress(),
			neighborhood: faker.location.street(),
			city: faker.location.city(),
			state: faker.location.state(),
			zipCode: faker.location.zipCode(),
			country: faker.location.country(),
			isDefault: false,
		})
		.returning();

	console.info(
		`✅ Secondary customer address created successfully with ID: ${secondaryAddress.id}`,
	);

	await seedActivity({
		type: "customerAddress.created",
		actorId: secondaryAddress.id,
		actorType: "customerAddress",
		customerId: userId,
	});

	return customerAddress;
}

async function seedProduct() {
	console.info("📦 Creating product...");

	const [product] = await seedDb
		.insert(schema.product)
		.values({
			name: faker.commerce.productName(),
			stock: faker.number.int({ min: 1, max: 100 }),
			status: faker.helpers.arrayElement(schema.productStatus.enumValues),
		})
		.returning();

	console.info(
		`✅ Product created successfully with ID: ${product.id}, name: ${product.name}`,
	);

	await seedActivity({
		type: "product.created",
		actorId: product.id,
		actorType: "product",
	});

	return product;
}

async function seedProductImage(productId: string) {
	console.info(`🖼️  Creating product image for product ID: ${productId}...`);

	const [productImage] = await seedDb
		.insert(schema.productImage)
		.values({
			productId,
			imageUrl: faker.image.urlPicsumPhotos({ width: 1000, height: 1000 }),
		})
		.returning();

	console.info(
		`✅ Product image created successfully with ID: ${productImage.id}`,
	);

	await seedActivity({
		type: "productImage.created",
		actorId: productImage.id,
		actorType: "productImage",
	});
}

async function seedProductPrice(productId: string) {
	console.info(`💰 Creating product price for product ID: ${productId}...`);

	const [productPriceDefault] = await seedDb
		.insert(schema.productPrice)
		.values({
			productId,
			priceInCents: faker.number.int({ min: 1000, max: 10000 }),
			discountPercentage: 0,
			isDefault: true,
		})
		.returning();

	console.info(
		`✅ Default product price created successfully with ID: ${productPriceDefault.id}, price: ${productPriceDefault.priceInCents} cents`,
	);

	await seedActivity({
		type: "productPrice.created",
		actorId: productPriceDefault.id,
		actorType: "productPrice",
	});

	const [productPriceSecondary] = await seedDb
		.insert(schema.productPrice)
		.values({
			productId,
			priceInCents: faker.number.int({ min: 1000, max: 10000 }),
			discountPercentage: 0,
			isDefault: false,
		})
		.returning();

	console.info(
		`✅ Secondary product price created successfully with ID: ${productPriceSecondary.id}, price: ${productPriceSecondary.priceInCents} cents`,
	);

	await seedActivity({
		type: "productPrice.created",
		actorId: productPriceSecondary.id,
		actorType: "productPrice",
	});

	return productPriceDefault;
}

async function seedCategory() {
	console.info("🏷️  Creating category...");

	const [category] = await seedDb
		.insert(schema.category)
		.values({
			name: faker.commerce.productMaterial(),
		})
		.returning();

	console.info(
		`✅ Category created successfully with ID: ${category.id}, name: ${category.name}`,
	);

	await seedActivity({
		type: "category.created",
		actorId: category.id,
		actorType: "category",
	});

	return category;
}

async function seedCategorySecondary(categoryId: string) {
	console.info(
		`🏷️  Creating secondary category for category ID: ${categoryId}...`,
	);

	const [categorySecondary] = await seedDb
		.insert(schema.categorySecondary)
		.values({
			categoryId,
			name: faker.commerce.productMaterial(),
		})
		.returning();

	console.info(
		`✅ Secondary category created successfully with ID: ${categorySecondary.id}, name: ${categorySecondary.name}`,
	);

	await seedActivity({
		type: "categorySecondary.created",
		actorId: categorySecondary.id,
		actorType: "categorySecondary",
	});
}

async function seedOrder({
	customerId,
	customerAddressId,
	totalPriceInCents,
}: {
	customerId: string;
	customerAddressId: string;
	totalPriceInCents: number;
}) {
	console.info(
		`🛒 Creating order for customer ID: ${customerId}, address ID: ${customerAddressId}, total: ${totalPriceInCents} cents...`,
	);

	const [order] = await seedDb
		.insert(schema.order)
		.values({
			customerId,
			customerAddressId,
			totalPriceInCents,
		})
		.returning();

	console.info(`✅ Order created successfully with ID: ${order.id}`);

	await seedActivity({
		type: "order.created",
		actorId: order.id,
		actorType: "order",
		customerId,
	});

	return order;
}

async function seedOrderProduct({
	orderId,
	productId,
	productPriceId,
	quantity,
}: {
	orderId: string;
	productId: string;
	productPriceId: string;
	quantity: number;
}) {
	console.info(
		`📦 Creating order product for order ID: ${orderId}, product ID: ${productId}, quantity: ${quantity}...`,
	);

	const [orderProduct] = await seedDb
		.insert(schema.orderProduct)
		.values({
			orderId,
			productId,
			productPriceId,
			quantity,
		})
		.returning();

	console.info(
		`✅ Order product created successfully with ID: ${orderProduct.id}`,
	);

	await seedActivity({
		type: "orderProduct.created",
		actorId: orderProduct.id,
		actorType: "orderProduct",
	});
}

async function seedOrderDelivery({ orderId }: { orderId: string }) {
	console.info(`🚚 Creating order delivery for order ID: ${orderId}...`);

	const [orderDelivery] = await seedDb
		.insert(schema.orderDelivery)
		.values({
			orderId,
		})
		.returning();

	console.info(
		`✅ Order delivery created successfully with ID: ${orderDelivery.id}`,
	);

	await seedActivity({
		type: "orderDelivery.created",
		actorId: orderDelivery.id,
		actorType: "orderDelivery",
	});
}

async function seedOrderPayment({ orderId }: { orderId: string }) {
	console.info(`💳 Creating order payment for order ID: ${orderId}...`);

	const [orderPayment] = await seedDb
		.insert(schema.orderPayment)
		.values({
			orderId,
		})
		.returning();

	console.info(
		`✅ Order payment created successfully with ID: ${orderPayment.id}`,
	);

	await seedActivity({
		type: "orderPayment.created",
		actorId: orderPayment.id,
		actorType: "orderPayment",
	});
}

async function seedActivity({
	type,
	actorId,
	actorType,
	customerId,
}: {
	type: string;
	actorId: string;
	actorType: string;
	customerId?: string;
}) {
	console.info(
		`📋 Creating activity of type: ${type}, actor ID: ${actorId}, actor type: ${actorType}${customerId ? `, customer ID: ${customerId}` : ""}...`,
	);

	const [activity] = await seedDb
		.insert(schema.activity)
		.values({
			type,
			actorId,
			actorType,
			customerId,
		})
		.returning();

	console.info(`✅ Activity created successfully with ID: ${activity.id}`);
}

async function seed() {
	try {
		console.info("🌱 Starting database seeding...");
		console.info(
			"📊 Database URL:",
			`${process.env.DATABASE_URL?.substring(0, 50)}...`,
		);

		// Test database connection
		await seedDb.execute(sql`SELECT 1`);
		console.info("✅ Database connection successful");

		// Clear existing data
		await clearDatabase();

		// Seed data in correct order
		const users = await seedUsers();
		for (const [index, user] of users.entries()) {
			await seedSessions(user.user.id);
			await seedAccounts(user.user.id);
			await seedVerifications(user.user.email);

			const customer = await seedCustomer(
				user.user.id,
				index === 0 ? "admin" : "customer",
			);
			const customerAddress = await seedCustomerAddress(customer.id);
			const product = await seedProduct();
			await seedProductImage(product.id);
			const productPrice = await seedProductPrice(product.id);
			const category = await seedCategory();
			await seedCategorySecondary(category.id);
			const randomProductQuantity = faker.number.int({ min: 1, max: 10 });
			const order = await seedOrder({
				customerId: customer.id,
				customerAddressId: customerAddress.id,
				totalPriceInCents: productPrice.priceInCents * randomProductQuantity,
			});
			await seedOrderProduct({
				orderId: order.id,
				productId: product.id,
				productPriceId: productPrice.id,
				quantity: randomProductQuantity,
			});
			await seedOrderDelivery({
				orderId: order.id,
			});
			await seedOrderPayment({
				orderId: order.id,
			});
		}

		process.exit(0);
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	}
}

// Run the seeding
seed();
