import { config } from "dotenv";

// Load environment variables from .env.local first, then .env
config({ path: ".env.local" });
config();

import { faker } from "@faker-js/faker";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
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
// Password hash "12341234"
const defaultPassword =
	"309cb9ae0272802462acadd782cf8efb:b6ad89b77f3def5c9168a769a92dfc4ef77b016e0a8468c3f333e5b790db3f3fd202d1142982fc1d52212492c165c3e0d1564a5b9dffb6f7c24cc955ca1a5a32";

// Password hashing function using bcrypt (compatible with better-auth)
function _hashPassword(password: string): string {
	// Use 10 rounds for bcrypt hashing (same as better-auth default)
	return bcrypt.hashSync(password, 10);
}

async function clearDatabase() {
	console.info("🗑️  Clearing existing data...");

	// Clear tables in correct order (respecting foreign key constraints)
	// Must delete child tables before parent tables

	// Clear activity records first (references customer)
	await seedDb.delete(schema.activity);

	// Clear order-related tables (depend on customer)
	await seedDb.delete(schema.orderPayment);
	await seedDb.delete(schema.orderDelivery);
	await seedDb.delete(schema.order);

	// Clear customer-related tables (depend on customer and user)
	await seedDb.delete(schema.customerAddress);
	await seedDb.delete(schema.customer);

	// Clear product-related tables
	await seedDb.delete(schema.productPrice);
	await seedDb.delete(schema.productImage);
	await seedDb.delete(schema.product);

	// Clear category tables
	await seedDb.delete(schema.categorySecondary);
	await seedDb.delete(schema.category);

	// Clear better-auth tables last (user is referenced by customer)
	await seedDb.delete(schema.session);
	await seedDb.delete(schema.account);
	await seedDb.delete(schema.user);

	console.info("✅ Database cleared successfully");
}

async function seedUsers() {
	console.info("👤 Creating users...");

	try {
		// Create admin user directly in database
		const [adminUserData] = await seedDb
			.insert(schema.user)
			.values({
				email: "admin@example.com",
				emailVerified: false,
				name: "Admin User",
				role: "admin",
			})
			.returning();

		console.info("✅ Admin user created successfully:", adminUserData);

		// Create customer user directly in database
		const [customerUserData] = await seedDb
			.insert(schema.user)
			.values({
				email: "customer@example.com",
				emailVerified: false,
				name: "Customer User",
				role: "user",
			})
			.returning();

		console.info("✅ Customer user created successfully:", customerUserData);

		return [adminUserData, customerUserData];
	} catch (error) {
		console.error("❌ Error creating users:", error);
		throw error;
	}
}

async function seedSessions(userId: string) {
	console.info(`🔐 Creating sample session for user ID: ${userId}...`);

	// Create a sample session (this would normally be done by better-auth during login)
	const [sessionData] = await seedDb
		.insert(schema.session)
		.values({
			userId,
			token: `token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
			ipAddress: "127.0.0.1",
			userAgent: "Mozilla/5.0 (Seeding Script)",
		})
		.returning();

	console.info("✅ Sample session created successfully:", sessionData);

	return sessionData;
}

async function seedAccounts(userId: string) {
	console.info(`🔗 Creating sample account for user ID: ${userId}...`);

	// Create a sample account record (for credential-based auth)
	const accountData = {
		providerId: "credential",
		accountId: userId,
		userId,
		password: defaultPassword,
	};

	await seedDb.insert(schema.account).values(accountData);

	console.info("✅ Sample account created successfully:", accountData);

	return accountData;
}

async function seedCustomer(userId: string) {
	console.info(`👤 Creating customer for user ID: ${userId}...`);

	const [customer] = await seedDb
		.insert(schema.customer)
		.values({
			userId,
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
		})
		.returning();

	console.info(`✅ Customer created successfully with ID: ${customer.id}`);

	await seedActivity({
		type: "customer.created",
		actorId: userId,
		actorType: "user",
		customerId: customer.id,
		metadata: {
			content: customer,
		},
	});

	return customer;
}

async function seedCustomerAddress(customerId: string, userId: string) {
	console.info(
		`🏠 Creating customer address for customer ID: ${customerId}...`,
	);

	const [customerAddress] = await seedDb
		.insert(schema.customerAddress)
		.values({
			customerId: customerId,
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
		actorId: userId,
		actorType: "user",
		customerId: customerId,
		metadata: {
			content: customerAddress,
		},
	});

	const [secondaryAddress] = await seedDb
		.insert(schema.customerAddress)
		.values({
			customerId: customerId,
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
		actorId: userId,
		actorType: "user",
		customerId: customerId,
		metadata: {
			content: secondaryAddress,
		},
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
		actorId: "system",
		actorType: "system",
		metadata: {
			content: product,
		},
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
		actorId: "system",
		actorType: "system",
		metadata: {
			content: productImage,
		},
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
		actorId: "system",
		actorType: "system",
		metadata: {
			content: productPriceDefault,
		},
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
		actorId: "system",
		actorType: "system",
		metadata: {
			content: productPriceSecondary,
		},
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
		actorId: "system",
		actorType: "system",
		metadata: {
			content: category,
		},
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
		actorId: "system",
		actorType: "system",
		metadata: {
			content: categorySecondary,
		},
	});
}

async function seedOrder({
	customerId,
	customerAddressId,
	totalPriceInCents,
	userId,
}: {
	customerId: string;
	customerAddressId: string;
	totalPriceInCents: number;
	userId: string;
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
		actorId: userId,
		actorType: "user",
		customerId,
		metadata: {
			content: order,
		},
	});

	return order;
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
		actorId: "system",
		actorType: "system",
		metadata: {
			content: orderDelivery,
		},
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
		actorId: "system",
		actorType: "system",
		metadata: {
			content: orderPayment,
		},
	});
}

async function seedActivity({
	type,
	actorId,
	actorType,
	customerId,
	metadata,
}: {
	type: string;
	actorId: string;
	actorType: string;
	customerId?: string;
	metadata?: any;
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
			metadata,
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
		for (const user of users) {
			await seedSessions(user.id);
			await seedAccounts(user.id);

			const customer = await seedCustomer(user.id);
			const customerAddress = await seedCustomerAddress(customer.id, user.id);
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
				userId: user.id,
			});
			await seedCartProduct({
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
