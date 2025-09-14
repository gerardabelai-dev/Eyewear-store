import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { generatePrefixId } from "./generate-prefix-id";

const timestamps = {
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
};

// Better-auth tables
export const user = pgTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("user")),
	name: text("name").notNull(),
	emailVerified: boolean("emailVerified").notNull().default(false),
	email: text("email").notNull().unique(),
	role: text("role").notNull().default("user"),
	image: text("image"),
	...timestamps,
});

export const session = pgTable("session", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("session")),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "set null" }),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	...timestamps,
});

export const account = pgTable("account", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("account")),
	providerId: text("providerId").notNull(),
	idToken: text("idToken"),
	accountId: text("accountId"),
	scope: text("scope"),
	password: text("password"),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "set null" }),
	...timestamps,
});

export const verification = pgTable("verification", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("verification")),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	...timestamps,
});

// E-commerce tables
// Customer
export const customer = pgTable("customer", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("customer")),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "set null" }),
	firstName: text("firstName").notNull(),
	lastName: text("lastName").notNull(),
	phoneNumber: text("phoneNumber"),
	...timestamps,
});

export const customerAddress = pgTable("customerAddress", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("customerAddress")),
	customerId: text("customerId")
		.notNull()
		.references(() => customer.id, { onDelete: "set null" }),
	street: text("street").notNull(),
	number: text("number"),
	hasNoNumber: boolean("hasNoNumber").notNull().default(false),
	complement: text("complement"),
	hasNoComplement: boolean("hasNoComplement").notNull().default(false),
	neighborhood: text("neighborhood").notNull(),
	city: text("city").notNull(),
	state: text("state").notNull(),
	zipCode: text("zipCode"),
	hasNozipCode: boolean("hasNozipCode").notNull().default(false),
	country: text("country").notNull(),
	isDefault: boolean("isDefault").notNull().default(false),
	...timestamps,
});

// Util

// Product
export const productStatus = pgEnum("productStatus", ["active", "inactive"]);

export const product = pgTable("product", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("product")),
	name: text("name").notNull(),
	slug: text("slug"),
	subtitle: text("subtitle"),
	description: text("description"),
	stock: integer("stock").notNull().default(0),
	status: productStatus("status").notNull().default("active"),
	...timestamps,
});

export const productImage = pgTable("productImage", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("productImage")),
	productId: text("productId")
		.notNull()
		.references(() => product.id, { onDelete: "set null" }),
	imageUrl: text("imageUrl").notNull(),
	isDefault: boolean("isDefault").notNull().default(false),
	...timestamps,
});

export const productPrice = pgTable("productPrice", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("productPrice")),
	productId: text("productId")
		.notNull()
		.references(() => product.id, { onDelete: "set null" }),
	priceInCents: integer("priceInCents").notNull().default(0),
	discountPercentage: integer("discountPercentage").notNull().default(0),
	isDefault: boolean("isDefault").notNull().default(false),
	...timestamps,
});

// Category
export const category = pgTable("category", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("category")),
	name: text("name").notNull(),
	slug: text("slug"),
	description: text("description"),
	...timestamps,
});

export const categorySecondary = pgTable("categorySecondary", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("categorySecondary")),
	categoryId: text("categoryId")
		.notNull()
		.references(() => category.id, { onDelete: "set null" }),
	name: text("name").notNull(),
	...timestamps,
});

// Collection
export const collection = pgTable("collection", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("collection")),
	name: text("name").notNull(),
	slug: text("slug"),
	description: text("description"),
	isActive: boolean("isActive").notNull().default(false),
	...timestamps,
});

export const collectionProduct = pgTable("collectionProduct", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("collectionProduct")),
	collectionId: text("collectionId")
		.notNull()
		.references(() => collection.id, { onDelete: "set null" }),
	productId: text("productId")
		.notNull()
		.references(() => product.id, { onDelete: "set null" }),
	...timestamps,
});

// Cart
export const cart = pgTable("cart", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("cart")),
	...timestamps,
});

export const cartProduct = pgTable("cartProduct", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("cartProduct")),
	cartId: text("cartId")
		.notNull()
		.references(() => cart.id, { onDelete: "set null" }),
	productId: text("productId")
		.notNull()
		.references(() => product.id, { onDelete: "set null" }),
	productPriceId: text("productPriceId")
		.notNull()
		.references(() => productPrice.id, { onDelete: "set null" }),
	parentProductId: text("parentProductId").references(() => product.id, {
		onDelete: "set null",
	}),
	quantity: integer("quantity").notNull().default(1),
	...timestamps,
});

// Order
export const orderStatus = pgEnum("orderStatus", [
	"pending",
	"paid",
	"cancelled",
]);
export const order = pgTable("order", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("order")),
	orderStatus: orderStatus("orderStatus").notNull().default("pending"),
	cartId: text("cartId")
		.notNull()
		.references(() => cart.id, { onDelete: "set null" }),
	customerId: text("customerId").references(() => customer.id, {
		onDelete: "set null",
	}),
	customerAddressId: text("customerAddressId").references(
		() => customerAddress.id,
		{ onDelete: "set null" },
	),
	...timestamps,
});

export const orderDeliveryMethod = pgTable("orderDeliveryMethod", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("orderDeliveryMethod")),
	method: text("method").notNull(),
	costInCents: integer("costInCents").notNull().default(0),
	...timestamps,
});

export const orderDeliveryStatus = pgEnum("orderDeliveryStatus", [
	"pending",
	"processing",
	"shipped",
	"delivered",
	"cancelled",
	"returned",
]);

export const orderDelivery = pgTable("orderDelivery", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("orderDelivery")),
	orderId: text("orderId")
		.notNull()
		.references(() => order.id, { onDelete: "set null" }),
	orderDeliveryMethodId: text("orderDeliveryMethodId")
		.notNull()
		.references(() => orderDeliveryMethod.id, { onDelete: "set null" }),
	orderDeliveryStatus: orderDeliveryStatus("orderDeliveryStatus")
		.notNull()
		.default("pending"),
	...timestamps,
});

export const orderPaymentMethod = pgTable("orderPaymentMethod", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("orderPaymentMethod")),
	method: text("method").notNull(),
	...timestamps,
});

export const orderPaymentStatus = pgEnum("orderPaymentStatus", [
	"pending",
	"paid",
	"failed",
]);

export const orderPayment = pgTable("orderPayment", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("orderPayment")),
	orderId: text("orderId")
		.notNull()
		.references(() => order.id, { onDelete: "set null" }),
	orderPaymentMethodId: text("orderPaymentMethodId")
		.notNull()
		.references(() => orderPaymentMethod.id, { onDelete: "set null" }),
	orderPaymentStatus: orderPaymentStatus("orderPaymentStatus")
		.notNull()
		.default("pending"),
	totalPriceInCents: integer("totalPriceInCents").notNull().default(0),
	// Stripe-specific fields
	stripePaymentIntentId: text("stripePaymentIntentId"),
	stripeClientSecret: text("stripeClientSecret"),
	stripePaymentMethodId: text("stripePaymentMethodId"),
	...timestamps,
});

// Activity
export const activity = pgTable("activity", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("activity")),
	type: text("type").notNull(),
	actorId: text("actorId").notNull(),
	actorType: text("actorType").notNull(),
	customerId: text("customerId").references(() => customer.id, {
		onDelete: "set null",
	}),
	metadata: jsonb("metadata"),
	...timestamps,
});

// Type exports - inferred from schema
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Customer = typeof customer.$inferSelect;
export type NewCustomer = typeof customer.$inferInsert;

export type CustomerAddress = typeof customerAddress.$inferSelect;
export type NewCustomerAddress = typeof customerAddress.$inferInsert;

export type Product = typeof product.$inferSelect;
export type NewProduct = typeof product.$inferInsert;

export type ProductImage = typeof productImage.$inferSelect;
export type NewProductImage = typeof productImage.$inferInsert;

export type ProductPrice = typeof productPrice.$inferSelect;
export type NewProductPrice = typeof productPrice.$inferInsert;

export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;

export type CategorySecondary = typeof categorySecondary.$inferSelect;
export type NewCategorySecondary = typeof categorySecondary.$inferInsert;

export type Order = typeof order.$inferSelect;
export type NewOrder = typeof order.$inferInsert;

export type OrderDelivery = typeof orderDelivery.$inferSelect;
export type NewOrderDelivery = typeof orderDelivery.$inferInsert;

export type OrderPayment = typeof orderPayment.$inferSelect;
export type NewOrderPayment = typeof orderPayment.$inferInsert;

export type Activity = typeof activity.$inferSelect;
export type NewActivity = typeof activity.$inferInsert;

export type Cart = typeof cart.$inferSelect;
export type NewCart = typeof cart.$inferInsert;

export type CartProduct = typeof cartProduct.$inferSelect;
export type NewCartProduct = typeof cartProduct.$inferInsert;

export type OrderDeliveryMethod = typeof orderDeliveryMethod.$inferSelect;
export type NewOrderDeliveryMethod = typeof orderDeliveryMethod.$inferInsert;

export type OrderPaymentMethod = typeof orderPaymentMethod.$inferSelect;
export type NewOrderPaymentMethod = typeof orderPaymentMethod.$inferInsert;

// Relations
export const userRelations = relations(user, ({ one, many }) => ({
	sessions: many(session),
	accounts: many(account),
	customer: one(customer),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const customerRelations = relations(customer, ({ one, many }) => ({
	user: one(user, {
		fields: [customer.userId],
		references: [user.id],
	}),
	addresses: many(customerAddress),
	orders: many(order),
	activities: many(activity),
}));

export const customerAddressRelations = relations(
	customerAddress,
	({ one, many }) => ({
		customer: one(customer, {
			fields: [customerAddress.customerId],
			references: [customer.id],
		}),
		orders: many(order),
	}),
);

export const productRelations = relations(product, ({ many }) => ({
	images: many(productImage),
	productPrice: many(productPrice),
	cartProducts: many(cartProduct),
}));

export const productImageRelations = relations(productImage, ({ one }) => ({
	product: one(product, {
		fields: [productImage.productId],
		references: [product.id],
	}),
}));

export const productPriceRelations = relations(
	productPrice,
	({ one, many }) => ({
		product: one(product, {
			fields: [productPrice.productId],
			references: [product.id],
		}),
		cartProducts: many(cartProduct),
	}),
);

export const categoryRelations = relations(category, ({ many }) => ({
	subcategories: many(categorySecondary),
}));

export const categorySecondaryRelations = relations(
	categorySecondary,
	({ one }) => ({
		category: one(category, {
			fields: [categorySecondary.categoryId],
			references: [category.id],
		}),
	}),
);

export const cartRelations = relations(cart, ({ many }) => ({
	cartProducts: many(cartProduct),
}));

export const cartProductRelations = relations(cartProduct, ({ one }) => ({
	cart: one(cart, {
		fields: [cartProduct.cartId],
		references: [cart.id],
	}),
	product: one(product, {
		fields: [cartProduct.productId],
		references: [product.id],
	}),
	productPrice: one(productPrice, {
		fields: [cartProduct.productPriceId],
		references: [productPrice.id],
	}),
}));

export const orderRelations = relations(order, ({ one }) => ({
	customer: one(customer, {
		fields: [order.customerId],
		references: [customer.id],
	}),
	customerAddress: one(customerAddress, {
		fields: [order.customerAddressId],
		references: [customerAddress.id],
	}),
	cart: one(cart, {
		fields: [order.cartId],
		references: [cart.id],
	}),
	delivery: one(orderDelivery, {
		fields: [order.id],
		references: [orderDelivery.orderId],
	}),
	payment: one(orderPayment),
}));

export const orderDeliveryRelations = relations(orderDelivery, ({ one }) => ({
	order: one(order, {
		fields: [orderDelivery.orderId],
		references: [order.id],
	}),
	orderDeliveryMethod: one(orderDeliveryMethod, {
		fields: [orderDelivery.orderDeliveryMethodId],
		references: [orderDeliveryMethod.id],
	}),
}));

export const orderPaymentRelations = relations(orderPayment, ({ one }) => ({
	order: one(order, {
		fields: [orderPayment.orderId],
		references: [order.id],
	}),
	orderPaymentMethod: one(orderPaymentMethod, {
		fields: [orderPayment.orderPaymentMethodId],
		references: [orderPaymentMethod.id],
	}),
}));

export const activityRelations = relations(activity, ({ one }) => ({
	customer: one(customer, {
		fields: [activity.customerId],
		references: [customer.id],
	}),
}));
