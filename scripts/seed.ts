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

	// Clear collection tables (must be before product)
	await seedDb.delete(schema.collectionProduct);
	await seedDb.delete(schema.collection);

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

	// Clear coupon table
	await seedDb.delete(schema.coupon);

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

	const productName = faker.commerce.productName();
	const productSlug = productName.toLowerCase().replace(/ /g, "-");

	const [product] = await seedDb
		.insert(schema.product)
		.values({
			name: productName,
			slug: productSlug,
			subtitle: "INCLUI LENTES DE GRAU LEVE",
			description:
				"Esse redondo bold da linha archt mistura presença e elegância, incorporando traços de modelos muito queridos pela nossa comunidade. A ponte francesa proporciona maior conforto e traz um encaixe mais provável para diferentes tipos de narizes, enquanto os pinos frontais acrescentam mais uma informação para esse modelo cheio de detalhes.",
			stock: faker.number.int({ min: 1, max: 100 }),
			status: "active",
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

// Product image URLs from CSV data
const PRODUCT_IMAGE_URLS = [
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/artem-mihailov-5aKB1P_fcLw-unsplash.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/colin-lloyd-uGS733o4Ukk-unsplash.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/eyekeeper-eyekeeper-cbRGn25fqv8-unsplash.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/glassesshop-7WUyUtVcKSk-unsplash.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/redowan-dhrubo-1KEVqrKDyUs-unsplash.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/xshades-sunglasses-RS-AetNFty8-unsplash.jpg",
	// Add some variety by repeating working URLs
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/artem-mihailov-5aKB1P_fcLw-unsplash.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/colin-lloyd-uGS733o4Ukk-unsplash.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/eyekeeper-eyekeeper-cbRGn25fqv8-unsplash.jpg",
	"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/glassesshop-7WUyUtVcKSk-unsplash.jpg",
];

async function seedProductImage(productId: string) {
	console.info(`🖼️  Creating product images for product ID: ${productId}...`);

	// Create 3-5 images per product, with the first one being the default
	const imageCount = faker.number.int({ min: 3, max: 5 });
	const productImages = [];

	for (let i = 0; i < imageCount; i++) {
		const [productImage] = await seedDb
			.insert(schema.productImage)
			.values({
				productId,
				imageUrl: faker.helpers.arrayElement(PRODUCT_IMAGE_URLS),
				isDefault: i === 0, // First image is the default
			})
			.returning();

		productImages.push(productImage);

		await seedActivity({
			type: "productImage.created",
			actorId: "system",
			actorType: "system",
			metadata: {
				content: productImage,
			},
		});
	}

	console.info(
		`✅ ${imageCount} product images created successfully for product ${productId}`,
	);

	return productImages;
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

async function seedLensCollections() {
	console.info("👓 Creating lens collections...");

	// Step 1 - Lens Type Selection
	const [lensTypeCollection] = await seedDb
		.insert(schema.collection)
		.values({
			name: "Escolha seu tipo de lente",
			slug: "tipo-de-lente",
			description: "Selecione a opção que melhor atende às suas necessidades",
			isActive: true,
		})
		.returning();

	console.info(
		`✅ Lens type collection created successfully with ID: ${lensTypeCollection.id}`,
	);

	await seedActivity({
		type: "collection.created",
		actorId: "system",
		actorType: "system",
		metadata: {
			content: lensTypeCollection,
		},
	});

	// Step 2 - Prescription Strength Selection
	const [prescriptionCollection] = await seedDb
		.insert(schema.collection)
		.values({
			name: "Selecione as lentes de acordo com seu grau",
			slug: "grau-das-lentes",
			description:
				"Assim que finalizar a compra vamos pedir os dados da sua receita. Não se preocupe, também vamos te lembrar via e-mail e sms!",
			isActive: true,
		})
		.returning();

	console.info(
		`✅ Prescription collection created successfully with ID: ${prescriptionCollection.id}`,
	);

	await seedActivity({
		type: "collection.created",
		actorId: "system",
		actorType: "system",
		metadata: {
			content: prescriptionCollection,
		},
	});

	// Step 3 - Lens Finishing Options
	const [finishingCollection] = await seedDb
		.insert(schema.collection)
		.values({
			name: "Selecione o acabamento das suas lentes",
			slug: "acabamento-das-lentes",
			description: "Escolha o tipo de acabamento para suas lentes",
			isActive: true,
		})
		.returning();

	console.info(
		`✅ Finishing collection created successfully with ID: ${finishingCollection.id}`,
	);

	await seedActivity({
		type: "collection.created",
		actorId: "system",
		actorType: "system",
		metadata: {
			content: finishingCollection,
		},
	});

	return {
		lensTypeCollection,
		prescriptionCollection,
		finishingCollection,
	};
}

async function seedLensProducts(collections: {
	lensTypeCollection: any;
	prescriptionCollection: any;
	finishingCollection: any;
}) {
	console.info("👓 Creating lens products...");

	const lensProducts = [];

	// Step 1 - Lens Type Products
	const lensTypeProducts = [
		{
			name: "Com grau",
			slug: "com-grau",
			description:
				"Lentes monofocais para correção de miopia, hipermetropia ou astigmatismo",
			price: 15000, // R$ 150.00 in cents
		},
		{
			name: "Sem grau | com filtro de luz azul",
			slug: "sem-grau-com-filtro-de-luz-azul",
			description:
				"Lentes sem grau ideais para quem está à procura de estilo e mais conforto visual. Perfeito para quem não desgruda os olhos das telas",
			price: 8000, // R$ 80.00 in cents
		},
		{
			name: "Sem grau | apenas a armação",
			slug: "sem-grau-apenas-armacao",
			description:
				"Armação acompanhada de lentes de demonstração feitas de acrílico e não recomendadas para o uso diário",
			price: 0, // Free - just the frame
		},
	];

	for (const productData of lensTypeProducts) {
		const [product] = await seedDb
			.insert(schema.product)
			.values({
				name: productData.name,
				slug: productData.slug,
				description: productData.description,
				stock: 999,
				status: "active",
			})
			.returning();

		const [productPrice] = await seedDb
			.insert(schema.productPrice)
			.values({
				productId: product.id,
				priceInCents: productData.price,
				discountPercentage: 0,
				isDefault: true,
			})
			.returning();

		// Link to collection
		await seedDb.insert(schema.collectionProduct).values({
			collectionId: collections.lensTypeCollection.id,
			productId: product.id,
		});

		lensProducts.push({ product, productPrice });

		await seedActivity({
			type: "product.created",
			actorId: "system",
			actorType: "system",
			metadata: {
				content: product,
			},
		});

		console.info(
			`✅ Lens type product created: ${product.name} (${product.slug})`,
		);
	}

	// Step 2 - Prescription Strength Products
	const prescriptionProducts = [
		{
			name: "Grau leve | até +/- 2,75",
			slug: "grau-leve",
			description:
				"Lentes com espessura padrão, feitas de resina. Contemplam hipermetropia e miopia até +/- 2,75 e astigmatismo até -2,00",
			price: 0,
		},
		{
			name: "Grau moderado | até +/- 4,00",
			slug: "grau-moderado",
			description:
				"Lentes mais leves e resistentes, feitas de policarbonato. Contemplam hipermetropia e miopia até +/- 4,00 e astigmatismo até -2,00",
			price: 30000, // R$ 300.00 in cents
		},
		{
			name: "Grau alto | até +5,00/-6,50",
			slug: "grau-alto",
			description:
				"Lentes mais finas e voltadas para graus mais altos, feitas de resina de alto índice. Contemplam hipermetropia até +5,00, miopia até -6,50, e astigmatismo até -4,00",
			price: 60000, // R$ 600.00 in cents
		},
	];

	for (const productData of prescriptionProducts) {
		const [product] = await seedDb
			.insert(schema.product)
			.values({
				name: productData.name,
				slug: productData.slug,
				description: productData.description,
				stock: 999,
				status: "active",
			})
			.returning();

		const [productPrice] = await seedDb
			.insert(schema.productPrice)
			.values({
				productId: product.id,
				priceInCents: productData.price,
				discountPercentage: 0,
				isDefault: true,
			})
			.returning();

		// Link to collection
		await seedDb.insert(schema.collectionProduct).values({
			collectionId: collections.prescriptionCollection.id,
			productId: product.id,
		});

		lensProducts.push({ product, productPrice });

		await seedActivity({
			type: "product.created",
			actorId: "system",
			actorType: "system",
			metadata: {
				content: product,
			},
		});

		console.info(
			`✅ Prescription product created: ${product.name} (${product.slug})`,
		);
	}

	// Step 3 - Lens Finishing Products
	const finishingProducts = [
		{
			name: "Clássico",
			slug: "classico",
			description:
				"Lentes com espessura padrão, feitas de resina. Contemplam hipermetropia e miopia até +/- 2,75 e astigmatismo até -2,00",
			price: 0,
		},
		{
			name: "Filtro de luz azul",
			slug: "filtro-de-luz-azul",
			description:
				"Além da resistência contra arranhões, antirreflexo e proteção UV, também filtram mais luz azul de aparelhos digitais e do sol do que lentes clássicas ou fotossensíveis. +O filtro de luz azul pode deixar um residual azulado ou esverdeado nas lentes.",
			price: 20000, // R$ 200.00 in cents
		},
	];

	for (const productData of finishingProducts) {
		const [product] = await seedDb
			.insert(schema.product)
			.values({
				name: productData.name,
				slug: productData.slug,
				description: productData.description,
				stock: 999,
				status: "active",
			})
			.returning();

		const [productPrice] = await seedDb
			.insert(schema.productPrice)
			.values({
				productId: product.id,
				priceInCents: productData.price,
				discountPercentage: 0,
				isDefault: true,
			})
			.returning();

		// Link to collection
		await seedDb.insert(schema.collectionProduct).values({
			collectionId: collections.finishingCollection.id,
			productId: product.id,
		});

		lensProducts.push({ product, productPrice });

		await seedActivity({
			type: "product.created",
			actorId: "system",
			actorType: "system",
			metadata: {
				content: product,
			},
		});

		console.info(
			`✅ Finishing product created: ${product.name} (${product.slug})`,
		);
	}

	return lensProducts;
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

async function seedOrderDeliveryMethods() {
	console.info("🚚 Creating order delivery methods...");

	const deliveryMethods = [
		{
			method: "Entrega Padrão",
			costInCents: 1500, // R$ 15.00
		},
		{
			method: "Entrega Expressa",
			costInCents: 2500, // R$ 25.00
		},
		{
			method: "Entrega no Mesmo Dia",
			costInCents: 4000, // R$ 40.00
		},
	];

	const createdMethods = [];

	for (const methodData of deliveryMethods) {
		const [orderDeliveryMethod] = await seedDb
			.insert(schema.orderDeliveryMethod)
			.values({
				method: methodData.method,
				costInCents: methodData.costInCents,
			})
			.returning();

		console.info(
			`✅ Order delivery method created successfully: ${orderDeliveryMethod.method} - R$ ${(orderDeliveryMethod.costInCents / 100).toFixed(2)}`,
		);

		await seedActivity({
			type: "orderDeliveryMethod.created",
			actorId: "system",
			actorType: "system",
			metadata: {
				content: orderDeliveryMethod,
			},
		});

		createdMethods.push(orderDeliveryMethod);
	}

	return createdMethods;
}

async function seedOrderPaymentMethods() {
	console.info("💳 Creating order payment methods...");

	// Create Credit Card payment method (for Stripe integration)
	const [creditCardMethod] = await seedDb
		.insert(schema.orderPaymentMethod)
		.values({
			method: "Credit Card",
		})
		.returning();

	console.info(
		`✅ Credit Card payment method created successfully with ID: ${creditCardMethod.id}`,
	);

	await seedActivity({
		type: "orderPaymentMethod.created",
		actorId: "system",
		actorType: "system",
		metadata: {
			content: creditCardMethod,
		},
	});

	// Create other payment methods
	const otherMethods = ["Debit Card", "PayPal", "Bank Transfer"];
	const paymentMethods = [creditCardMethod];

	for (const method of otherMethods) {
		const [paymentMethod] = await seedDb
			.insert(schema.orderPaymentMethod)
			.values({
				method,
			})
			.returning();

		console.info(
			`✅ ${method} payment method created successfully with ID: ${paymentMethod.id}`,
		);

		await seedActivity({
			type: "orderPaymentMethod.created",
			actorId: "system",
			actorType: "system",
			metadata: {
				content: paymentMethod,
			},
		});

		paymentMethods.push(paymentMethod);
	}

	return paymentMethods;
}

async function _seedOrderDelivery({
	orderId,
	orderDeliveryMethods,
}: {
	orderId: string;
	orderDeliveryMethods: any[];
}) {
	console.info(`🚚 Creating order delivery for order ID: ${orderId}...`);

	// Select a random delivery method for this order
	const selectedMethod = faker.helpers.arrayElement(orderDeliveryMethods);

	const [orderDelivery] = await seedDb
		.insert(schema.orderDelivery)
		.values({
			orderId,
			orderDeliveryMethodId: selectedMethod.id,
			estimatedDeliveryDays: faker.number.int({ min: 3, max: 15 }),
			trackingCode: faker.string.alphanumeric({ length: 13, casing: "upper" }),
		})
		.returning();

	console.info(
		`✅ Order delivery created successfully with ID: ${orderDelivery.id} using method: ${selectedMethod.method}`,
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

async function _seedOrderPayment({
	orderId,
	orderPaymentMethodId,
	totalPriceInCents,
	shippingCostInCents,
}: {
	orderId: string;
	orderPaymentMethodId: string;
	totalPriceInCents: number;
	shippingCostInCents: number;
}) {
	console.info(`💳 Creating order payment for order ID: ${orderId}...`);

	// Calculate subtotal (total - shipping)
	const subtotalInCents = totalPriceInCents - shippingCostInCents;
	const taxInCents = 0; // Tax calculation will be implemented later

	const [orderPayment] = await seedDb
		.insert(schema.orderPayment)
		.values({
			orderId,
			orderPaymentMethodId,
			subtotalInCents,
			shippingCostInCents,
			taxInCents,
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

async function seedCoupons() {
	console.info("🎟️  Creating coupons...");

	const coupons = [];

	// Create a percentage discount coupon (10% off)
	const [percentageCoupon] = await seedDb
		.insert(schema.coupon)
		.values({
			code: "WELCOME10",
			type: "percentage",
			discountPercentage: 10,
			minOrderValueInCents: 5000, // R$ 50,00 minimum
			maxDiscountInCents: 5000, // R$ 50,00 max discount
			usageLimit: 100,
			usageCount: 0,
			validFrom: new Date(),
			validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
			status: "active",
		})
		.returning();

	console.info(`✅ Percentage coupon created: ${percentageCoupon.code}`);
	coupons.push(percentageCoupon);

	// Create a fixed amount coupon (R$ 20 off)
	const [fixedCoupon] = await seedDb
		.insert(schema.coupon)
		.values({
			code: "SAVE20",
			type: "fixed_amount",
			discountAmountInCents: 2000, // R$ 20,00
			minOrderValueInCents: 10000, // R$ 100,00 minimum
			usageLimit: 50,
			usageCount: 0,
			validFrom: new Date(),
			validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
			status: "active",
		})
		.returning();

	console.info(`✅ Fixed amount coupon created: ${fixedCoupon.code}`);
	coupons.push(fixedCoupon);

	// Create an unlimited percentage coupon (5% off, no usage limit)
	const [unlimitedCoupon] = await seedDb
		.insert(schema.coupon)
		.values({
			code: "VIP5",
			type: "percentage",
			discountPercentage: 5,
			minOrderValueInCents: null,
			maxDiscountInCents: null,
			usageLimit: null, // Unlimited
			usageCount: 0,
			validFrom: new Date(),
			validUntil: null, // No expiration
			status: "active",
		})
		.returning();

	console.info(`✅ Unlimited coupon created: ${unlimitedCoupon.code}`);
	coupons.push(unlimitedCoupon);

	// Create an expired coupon for testing
	const [expiredCoupon] = await seedDb
		.insert(schema.coupon)
		.values({
			code: "EXPIRED20",
			type: "percentage",
			discountPercentage: 20,
			minOrderValueInCents: 5000,
			maxDiscountInCents: 10000,
			usageLimit: 100,
			usageCount: 0,
			validFrom: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
			validUntil: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
			status: "expired",
		})
		.returning();

	console.info(`✅ Expired coupon created: ${expiredCoupon.code}`);
	coupons.push(expiredCoupon);

	console.info(`✅ Created ${coupons.length} coupons successfully`);
	return coupons;
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
		const _orderDeliveryMethods = await seedOrderDeliveryMethods();
		const orderPaymentMethods = await seedOrderPaymentMethods();

		// Create coupons
		await seedCoupons();

		// Use Credit Card as the default payment method for seeded orders
		const _defaultPaymentMethod =
			orderPaymentMethods.find((method) => method.method === "Credit Card") ||
			orderPaymentMethods[0];

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

		// Create lens collections and products
		const lensCollections = await seedLensCollections();
		await seedLensProducts(lensCollections);

		// Create orders for each user
		for (const user of users) {
			await seedSessions(user.id);
			await seedAccounts(user.id);

			const customer = await seedCustomer(user.id);
			const customerAddress = await seedCustomerAddress(customer.id, user.id);

			// Create cart and add random products
			const cart = await seedCart();
			let _totalPriceInCents = 0;

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

				_totalPriceInCents +=
					randomProduct.productPrice.priceInCents * randomQuantity;
			}

			const _order = await seedOrder({
				customerId: customer.id,
				customerAddressId: customerAddress.id,
				cartId: cart.id,
				userId: user.id,
			});

			// Don't create order delivery and payment for seeded orders
			// This allows users to go through the proper checkout flow
			// and select shipping methods and payment methods themselves

			// await seedOrderDelivery({
			// 	orderId: order.id,
			// 	orderDeliveryMethods,
			// });

			// await seedOrderPayment({
			// 	orderId: order.id,
			// 	orderPaymentMethodId: defaultPaymentMethod.id,
			// 	totalPriceInCents,
			// });
		}

		process.exit(0);
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	}
}

// Run the seeding
seed();
