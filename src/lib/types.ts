// Client-safe types - no server dependencies
export interface User {
	id: string;
	email: string;
	name?: string;
	firstName?: string;
	lastName?: string;
	image?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Category {
	id: string;
	name: string;
	description?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Subcategory {
	id: string;
	name: string;
	description?: string;
	categoryId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Product {
	id: string;
	name: string;
	description?: string;
	price: string;
	stock: number;
	status: "active" | "inactive";
	images: string[];
	categoryId?: string;
	subcategoryId?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderStatus {
	id: string;
	name: string;
	color: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Order {
	id: string;
	orderNumber: string;
	userId: string;
	customerName: string;
	customerEmail: string;
	customerPhone?: string;
	statusId: string;
	totalAmount: string;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderItem {
	id: string;
	orderId: string;
	productId: string;
	quantity: number;
	unitPrice: string;
	createdAt: Date;
	updatedAt: Date;
}
