import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

// User
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	passwordHash: text("password_hash").notNull(),
	email: text("email").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userRole = pgTable("user_role", {
	id: text("id").primaryKey(),
	label: text("label").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userAddress = pgTable("user_address", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	street: text("street").notNull(),
	number: text("number").notNull(),
	complement: text("complement"),
	neighborhood: text("neighborhood").notNull(),
	city: text("city").notNull(),
	state: text("state").notNull(),
	zipCode: text("zip_code").notNull(),
	country: text("country").notNull(),
	isDefault: boolean("is_default").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Auth
export const authSession = pgTable("auth_session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	googleAccessToken: text("google_access_token"),
	googleRefreshToken: text("google_refresh_token"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	ipAddress: text("ip_address"),
	clientAgent: text("client_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

// Category
export const category = pgTable("category", {
	id: text("id").primaryKey(),
	label: text("label").notNull().unique(),
	slug: text("slug").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const subcategory = pgTable("subcategory", {
	id: text("id").primaryKey(),
	label: text("label").notNull(),
	slug: text("slug").notNull(),
	categoryId: text("category_id")
		.notNull()
		.references(() => category.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Product
export const product = pgTable("product", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	categoryId: text("category_id").references(() => category.id, {
		onDelete: "set null",
	}),
	subcategoryId: text("subcategory_id").references(() => subcategory.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productStatus = pgTable("product_status", {
	id: text("id").primaryKey(),
	status: text("status").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productImage = pgTable("product_image", {
	id: text("id").primaryKey(),
	productId: text("product_id")
		.notNull()
		.references(() => product.id, { onDelete: "cascade" }),
	imageUrl: text("image_url").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productPrice = pgTable("product_price", {
	id: text("id").primaryKey(),
	productId: text("product_id")
		.notNull()
		.references(() => product.id, { onDelete: "cascade" }),
	price: integer("price").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productStock = pgTable("product_stock", {
	id: text("id").primaryKey(),
	productId: text("product_id")
		.notNull()
		.references(() => product.id, { onDelete: "cascade" }),
	stock: integer("stock").notNull().default(0),
});

// Order
export const order = pgTable("order", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderProduct = pgTable("order_product", {
	id: text("id").primaryKey(),
	orderId: text("order_id")
		.notNull()
		.references(() => order.id, { onDelete: "cascade" }),
	productPriceId: text("product_price_id")
		.notNull()
		.references(() => productPrice.id, { onDelete: "cascade" }),
	quantity: integer("quantity").default(1).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderStatus = pgTable("order_status", {
	id: text("id").primaryKey(),
	status: text("status").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
