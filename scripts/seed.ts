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

	// Clear cart-related tables
	await seedDb.delete(schema.cartProduct);
	await seedDb.delete(schema.cart);

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

	// Clear order method tables
	await seedDb.delete(schema.orderDeliveryMethod);
	await seedDb.delete(schema.orderPaymentMethod);

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

// Product image URLs
const PRODUCT_IMAGE_URLS = [
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057080-aatrox.webp",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Chogath_5.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Galio_1.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Kennen_2.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Quinn_1.jpg",
];

async function seedProductImage(productId: string) {
	console.info(`🖼️  Creating product image for product ID: ${productId}...`);

	const [productImage] = await seedDb
		.insert(schema.productImage)
		.values({
			productId,
			imageUrl: faker.helpers.arrayElement(PRODUCT_IMAGE_URLS),
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

async function seedCart() {
	console.info("🛒 Creating cart...");

	const [cart] = await seedDb.insert(schema.cart).values({}).returning();

	console.info(`✅ Cart created successfully with ID: ${cart.id}`);

	await seedActivity({
		type: "cart.created",
		actorId: "system",
		actorType: "system",
		metadata: {
			content: cart,
		},
	});

	return cart;
}

async function seedCartProduct({
	cartId,
	productId,
	productPriceId,
	quantity,
}: {
	cartId: string;
	productId: string;
	productPriceId: string;
	quantity: number;
}) {
	console.info(
		`🛒 Creating cart product for cart ID: ${cartId}, product ID: ${productId}, quantity: ${quantity}...`,
	);

	const [cartProduct] = await seedDb
		.insert(schema.cartProduct)
		.values({
			cartId,
			productId,
			productPriceId,
			quantity,
		})
		.returning();

	console.info(
		`✅ Cart product created successfully with ID: ${cartProduct.id}`,
	);

	await seedActivity({
		type: "cartProduct.created",
		actorId: "system",
		actorType: "system",
		metadata: {
			content: cartProduct,
		},
	});

	return cartProduct;
}

async function seedOrder({
	customerId,
	customerAddressId,
	cartId,
	userId,
}: {
	customerId: string;
	customerAddressId: string;
	cartId: string;
	userId: string;
}) {
	console.info(
		`🛒 Creating order for customer ID: ${customerId}, address ID: ${customerAddressId}, cart ID: ${cartId}...`,
	);

	const [order] = await seedDb
		.insert(schema.order)
		.values({
			customerId,
			customerAddressId,
			cartId,
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

async function seedOrderDeliveryMethod() {
	console.info("🚚 Creating order delivery method...");

	const [orderDeliveryMethod] = await seedDb
		.insert(schema.orderDeliveryMethod)
		.values({
			method: faker.helpers.arrayElement([
				"Standard Delivery",
				"Express Delivery",
				"Overnight Delivery",
			]),
			costInCents: faker.number.int({ min: 500, max: 2000 }),
		})
		.returning();

	console.info(
		`✅ Order delivery method created successfully with ID: ${orderDeliveryMethod.id}`,
	);

	await seedActivity({
		type: "orderDeliveryMethod.created",
		actorId: "system",
		actorType: "system",
		metadata: {
			content: orderDeliveryMethod,
		},
	});

	return orderDeliveryMethod;
}

async function seedOrderPaymentMethod() {
	console.info("💳 Creating order payment method...");

	const [orderPaymentMethod] = await seedDb
		.insert(schema.orderPaymentMethod)
		.values({
			method: faker.helpers.arrayElement([
				"Credit Card",
				"Debit Card",
				"PayPal",
				"Bank Transfer",
			]),
		})
		.returning();

	console.info(
		`✅ Order payment method created successfully with ID: ${orderPaymentMethod.id}`,
	);

	await seedActivity({
		type: "orderPaymentMethod.created",
		actorId: "system",
		actorType: "system",
		metadata: {
			content: orderPaymentMethod,
		},
	});

	return orderPaymentMethod;
}

async function seedOrderDelivery({
	orderId,
	orderDeliveryMethodId,
}: {
	orderId: string;
	orderDeliveryMethodId: string;
}) {
	console.info(`🚚 Creating order delivery for order ID: ${orderId}...`);

	const [orderDelivery] = await seedDb
		.insert(schema.orderDelivery)
		.values({
			orderId,
			orderDeliveryMethodId,
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

async function seedOrderPayment({
	orderId,
	orderPaymentMethodId,
	totalPriceInCents,
}: {
	orderId: string;
	orderPaymentMethodId: string;
	totalPriceInCents: number;
}) {
	console.info(`💳 Creating order payment for order ID: ${orderId}...`);

	const [orderPayment] = await seedDb
		.insert(schema.orderPayment)
		.values({
			orderId,
			orderPaymentMethodId,
			totalPriceInCents,
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

		// Create delivery and payment methods first (needed for orders)
		const orderDeliveryMethod = await seedOrderDeliveryMethod();
		const orderPaymentMethod = await seedOrderPaymentMethod();

		// Create 10 products
		const products = [];
		for (let i = 0; i < 10; i++) {
			const product = await seedProduct();
			await seedProductImage(product.id);
			const productPrice = await seedProductPrice(product.id);
			products.push({ product, productPrice });
		}

		// Create 3 categories with 2 subcategories each
		for (let i = 0; i < 3; i++) {
			const category = await seedCategory();
			for (let j = 0; j < 2; j++) {
				await seedCategorySecondary(category.id);
			}
		}

		// Create orders for each user
		for (const user of users) {
			await seedSessions(user.id);
			await seedAccounts(user.id);

			const customer = await seedCustomer(user.id);
			const customerAddress = await seedCustomerAddress(customer.id, user.id);

			// Create cart and add random products
			const cart = await seedCart();
			let totalPriceInCents = 0;

			// Add 1-3 random products to cart
			const numberOfProducts = faker.number.int({ min: 1, max: 3 });
			for (let i = 0; i < numberOfProducts; i++) {
				const randomProduct = faker.helpers.arrayElement(products);
				const randomQuantity = faker.number.int({ min: 1, max: 5 });

				await seedCartProduct({
					cartId: cart.id,
					productId: randomProduct.product.id,
					productPriceId: randomProduct.productPrice.id,
					quantity: randomQuantity,
				});

				totalPriceInCents +=
					randomProduct.productPrice.priceInCents * randomQuantity;
			}

			const order = await seedOrder({
				customerId: customer.id,
				customerAddressId: customerAddress.id,
				cartId: cart.id,
				userId: user.id,
			});

			await seedOrderDelivery({
				orderId: order.id,
				orderDeliveryMethodId: orderDeliveryMethod.id,
			});

			await seedOrderPayment({
				orderId: order.id,
				orderPaymentMethodId: orderPaymentMethod.id,
				totalPriceInCents,
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
