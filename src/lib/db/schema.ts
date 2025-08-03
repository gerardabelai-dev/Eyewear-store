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
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull().default(false),
	image: text("image"),
	...timestamps,
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
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
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "set null" }),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	...timestamps,
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	...timestamps,
});

// E-commerce tables
export const customerRole = pgEnum("customerRole", ["admin", "customer"]);

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
	role: customerRole("role").notNull().default("customer"),
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
