import {
	boolean,
	integer,
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
	complement: text("complement"),
	neighborhood: text("neighborhood").notNull(),
	city: text("city").notNull(),
	state: text("state").notNull(),
	zipCode: text("zipCode"),
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

// Order
export const order = pgTable("order", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("order")),
	customerId: text("customerId")
		.notNull()
		.references(() => customer.id, { onDelete: "set null" }),
	customerAddressId: text("customerAddressId")
		.notNull()
		.references(() => customerAddress.id, { onDelete: "set null" }),
	totalPriceInCents: integer("totalPriceInCents").notNull().default(0),
	...timestamps,
});

export const orderProduct = pgTable("orderProduct", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("orderProduct")),
	orderId: text("orderId")
		.notNull()
		.references(() => order.id, { onDelete: "set null" }),
	productId: text("productId")
		.notNull()
		.references(() => product.id, { onDelete: "set null" }),
	productPriceId: text("productPriceId")
		.notNull()
		.references(() => productPrice.id, { onDelete: "set null" }),
	quantity: integer("quantity").notNull().default(1),
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
	orderDeliveryStatus: orderDeliveryStatus("orderDeliveryStatus")
		.notNull()
		.default("pending"),
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
	orderPaymentStatus: orderPaymentStatus("orderPaymentStatus")
		.notNull()
		.default("pending"),
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

export type OrderProduct = typeof orderProduct.$inferSelect;
export type NewOrderProduct = typeof orderProduct.$inferInsert;

export type OrderDelivery = typeof orderDelivery.$inferSelect;
export type NewOrderDelivery = typeof orderDelivery.$inferInsert;

export type OrderPayment = typeof orderPayment.$inferSelect;
export type NewOrderPayment = typeof orderPayment.$inferInsert;

export type Activity = typeof activity.$inferSelect;
export type NewActivity = typeof activity.$inferInsert;
