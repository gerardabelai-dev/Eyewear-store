import {
	boolean,
	decimal,
	integer,
	json,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull().default(false),
	image: text("image"),
	firstName: text("firstName"),
	lastName: text("lastName"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const category = pgTable("category", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const subcategory = pgTable("subcategory", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
	description: text("description"),
	categoryId: text("categoryId")
		.notNull()
		.references(() => category.id, { onDelete: "cascade" }),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const product = pgTable("product", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	price: decimal("price", { precision: 10, scale: 2 }).notNull(),
	stock: integer("stock").notNull().default(0),
	categoryId: text("categoryId")
		.notNull()
		.references(() => category.id, { onDelete: "restrict" }),
	subcategoryId: text("subcategoryId").references(() => subcategory.id, {
		onDelete: "restrict",
	}),
	images: json("images").$type<string[]>().default([]),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const order = pgTable("order", {
	id: text("id").primaryKey(),
	orderNumber: text("orderNumber").notNull().unique(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	customerName: text("customerName").notNull(),
	customerEmail: text("customerEmail").notNull(),
	customerPhone: text("customerPhone"),
	status: text("status").notNull().default("pending"), // pending, processing, completed, cancelled
	totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
	notes: text("notes"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const orderItem = pgTable("orderItem", {
	id: text("id").primaryKey(),
	orderId: text("orderId")
		.notNull()
		.references(() => order.id, { onDelete: "cascade" }),
	productId: text("productId")
		.notNull()
		.references(() => product.id, { onDelete: "restrict" }),
	quantity: integer("quantity").notNull(),
	unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
	totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Notification system tables
export const userNotificationSettings = pgTable("user_notification_settings", {
	id: text("id").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" })
		.unique(),
	// Notification preferences - true means enabled
	marketing: boolean("marketing").notNull().default(true),
	orderUpdates: boolean("order_updates").notNull().default(true),
	systemNotifications: boolean("system_notifications").notNull().default(true),
	promotions: boolean("promotions").notNull().default(true),
	newsletters: boolean("newsletters").notNull().default(true),
	// Channel preferences
	emailEnabled: boolean("email_enabled").notNull().default(true),
	smsEnabled: boolean("sms_enabled").notNull().default(false),
	pushEnabled: boolean("push_enabled").notNull().default(true),
	whatsappEnabled: boolean("whatsapp_enabled").notNull().default(false),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const userNotification = pgTable("user_notification", {
	id: text("id").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	// Notification type
	notificationType: text("notification_type").notNull(), // "marketing", "order_updates", "system_notifications", "transactional", "promotions", "newsletters"
	// Channel used
	channel: text("channel").notNull(), // "email", "sms", "push", "whatsapp", "web"
	// Content and metadata
	subject: text("subject"),
	content: text("content"),
	metadata: json("metadata").$type<Record<string, any>>().default({}),
	// External service tracking
	externalId: text("external_id"), // Resend message ID, SMS gateway ID, etc.
	externalProvider: text("external_provider"), // "resend", "twilio", "firebase", etc.
	// Status tracking
	status: text("status").notNull().default("pending"), // "pending", "sent", "delivered", "failed", "opened", "clicked"
	sentAt: timestamp("sent_at"),
	deliveredAt: timestamp("delivered_at"),
	openedAt: timestamp("opened_at"),
	clickedAt: timestamp("clicked_at"),
	failedAt: timestamp("failed_at"),
	failureReason: text("failure_reason"),
	// Unsubscribe tracking
	unsubscribeToken: text("unsubscribe_token").unique(),
	unsubscribedAt: timestamp("unsubscribed_at"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;
export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;
export type Subcategory = typeof subcategory.$inferSelect;
export type NewSubcategory = typeof subcategory.$inferInsert;
export type Product = typeof product.$inferSelect;
export type NewProduct = typeof product.$inferInsert;
export type Order = typeof order.$inferSelect;
export type NewOrder = typeof order.$inferInsert;
export type OrderItem = typeof orderItem.$inferSelect;
export type NewOrderItem = typeof orderItem.$inferInsert;
export type UserNotificationSettings =
	typeof userNotificationSettings.$inferSelect;
export type NewUserNotificationSettings =
	typeof userNotificationSettings.$inferInsert;
export type UserNotification = typeof userNotification.$inferSelect;
export type NewUserNotification = typeof userNotification.$inferInsert;
