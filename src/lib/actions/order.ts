"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import {
	category,
	order,
	orderItem,
	product,
	subcategory,
	user,
} from "@/lib/db/schema";

// Schemas for validation
const orderItemSchema = z.object({
	productId: z.string().min(1, "ID do produto é obrigatório"),
	quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
	unitPrice: z.string().refine((val: string) => {
		const num = parseFloat(val);
		return !Number.isNaN(num) && num > 0;
	}, "Preço unitário deve ser um valor válido maior que 0"),
});

const createOrderSchema = z.object({
	customerName: z.string().min(1, "Nome do cliente é obrigatório"),
	customerEmail: z.string().email("E-mail inválido"),
	customerPhone: z.string().optional(),
	notes: z.string().optional(),
	items: z.array(orderItemSchema).min(1, "Pelo menos um item é obrigatório"),
});

const updateOrderStatusSchema = z.object({
	id: z.string().min(1, "ID do pedido é obrigatório"),
	status: z.enum(["pending", "processing", "completed", "cancelled"], {
		errorMap: () => ({ message: "Status inválido" }),
	}),
});

// Generate order number
function generateOrderNumber(): string {
	const timestamp = Date.now().toString();
	const random = Math.random().toString(36).substring(2, 8).toUpperCase();
	return `PED-${timestamp.slice(-6)}${random}`;
}

// Get all orders with details
export async function getOrders() {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const orders = await db
			.select({
				id: order.id,
				orderNumber: order.orderNumber,
				userId: order.userId,
				customerName: order.customerName,
				customerEmail: order.customerEmail,
				customerPhone: order.customerPhone,
				status: order.status,
				totalAmount: order.totalAmount,
				notes: order.notes,
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
			})
			.from(order)
			.where(eq(order.userId, currentUser.id))
			.orderBy(desc(order.createdAt));

		return { data: orders };
	} catch (error) {
		console.error("Erro ao buscar pedidos:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Get order by ID with items
export async function getOrderById(orderId: string) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const orderData = await db
			.select({
				id: order.id,
				orderNumber: order.orderNumber,
				userId: order.userId,
				customerName: order.customerName,
				customerEmail: order.customerEmail,
				customerPhone: order.customerPhone,
				status: order.status,
				totalAmount: order.totalAmount,
				notes: order.notes,
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
			})
			.from(order)
			.where(and(eq(order.id, orderId), eq(order.userId, currentUser.id)))
			.limit(1);

		if (!orderData.length) {
			return { error: "Pedido não encontrado" };
		}

		const items = await db
			.select({
				id: orderItem.id,
				orderId: orderItem.orderId,
				productId: orderItem.productId,
				quantity: orderItem.quantity,
				unitPrice: orderItem.unitPrice,
				totalPrice: orderItem.totalPrice,
				productName: product.name,
				productDescription: product.description,
				productImages: product.images,
				categoryName: category.name,
				subcategoryName: subcategory.name,
			})
			.from(orderItem)
			.leftJoin(product, eq(orderItem.productId, product.id))
			.leftJoin(category, eq(product.categoryId, category.id))
			.leftJoin(subcategory, eq(product.subcategoryId, subcategory.id))
			.where(eq(orderItem.orderId, orderId));

		return {
			data: {
				...orderData[0],
				items,
			},
		};
	} catch (error) {
		console.error("Erro ao buscar pedido:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Create a new order
export async function createOrder(data: z.infer<typeof createOrderSchema>) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const validatedData = createOrderSchema.parse(data);

		// Validate products exist and have sufficient stock
		const productIds = validatedData.items.map((item) => item.productId);
		const products = await db
			.select()
			.from(product)
			.where(eq(product.id, productIds[0])); // We'll validate all products

		const allProducts = await db.select().from(product);

		const productsMap = new Map(allProducts.map((p) => [p.id, p]));

		// Validate each item
		for (const item of validatedData.items) {
			const productData = productsMap.get(item.productId);
			if (!productData) {
				return { error: `Produto ${item.productId} não encontrado` };
			}
			if (productData.stock < item.quantity) {
				return {
					error: `Estoque insuficiente para o produto ${productData.name}`,
				};
			}
		}

		// Calculate total amount
		const totalAmount = validatedData.items.reduce((sum, item) => {
			return sum + parseFloat(item.unitPrice) * item.quantity;
		}, 0);

		// Create order
		const newOrder = await db
			.insert(order)
			.values({
				id: crypto.randomUUID(),
				orderNumber: generateOrderNumber(),
				userId: currentUser.id,
				customerName: validatedData.customerName,
				customerEmail: validatedData.customerEmail,
				customerPhone: validatedData.customerPhone || null,
				status: "pending",
				totalAmount: totalAmount.toString(),
				notes: validatedData.notes || null,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		// Create order items
		const orderItems = validatedData.items.map((item) => ({
			id: crypto.randomUUID(),
			orderId: newOrder[0].id,
			productId: item.productId,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			totalPrice: (parseFloat(item.unitPrice) * item.quantity).toString(),
			createdAt: new Date(),
			updatedAt: new Date(),
		}));

		await db.insert(orderItem).values(orderItems);

		// Update product stock
		for (const item of validatedData.items) {
			const productData = productsMap.get(item.productId);
			if (productData) {
				await db
					.update(product)
					.set({
						stock: productData.stock - item.quantity,
						updatedAt: new Date(),
					})
					.where(eq(product.id, item.productId));
			}
		}

		revalidatePath("/pedidos");
		revalidatePath("/produtos");
		return { data: newOrder[0], success: "Pedido criado com sucesso" };
	} catch (error) {
		console.error("Erro ao criar pedido:", error);
		if (error instanceof z.ZodError) {
			return {
				error: error.errors[0]?.message || "Dados inválidos fornecidos",
			};
		}
		return { error: "Erro interno do servidor" };
	}
}

// Update order status
export async function updateOrderStatus(
	data: z.infer<typeof updateOrderStatusSchema>,
) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const validatedData = updateOrderStatusSchema.parse(data);

		// Check if order exists and belongs to current user
		const existingOrder = await db
			.select()
			.from(order)
			.where(
				and(eq(order.id, validatedData.id), eq(order.userId, currentUser.id)),
			)
			.limit(1);

		if (!existingOrder.length) {
			return { error: "Pedido não encontrado" };
		}

		// If cancelling order, restore product stock
		if (
			validatedData.status === "cancelled" &&
			existingOrder[0].status !== "cancelled"
		) {
			const items = await db
				.select()
				.from(orderItem)
				.where(eq(orderItem.orderId, validatedData.id));

			for (const item of items) {
				const productData = await db
					.select()
					.from(product)
					.where(eq(product.id, item.productId))
					.limit(1);

				if (productData.length > 0) {
					await db
						.update(product)
						.set({
							stock: productData[0].stock + item.quantity,
							updatedAt: new Date(),
						})
						.where(eq(product.id, item.productId));
				}
			}
		}

		const updatedOrder = await db
			.update(order)
			.set({
				status: validatedData.status,
				updatedAt: new Date(),
			})
			.where(eq(order.id, validatedData.id))
			.returning();

		revalidatePath("/pedidos");
		return {
			data: updatedOrder[0],
			success: "Status do pedido atualizado com sucesso",
		};
	} catch (error) {
		console.error("Erro ao atualizar status do pedido:", error);
		if (error instanceof z.ZodError) {
			return {
				error: error.errors[0]?.message || "Dados inválidos fornecidos",
			};
		}
		return { error: "Erro interno do servidor" };
	}
}

// Get order statistics
export async function getOrderStats() {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const orders = await db
			.select({
				status: order.status,
				totalAmount: order.totalAmount,
				createdAt: order.createdAt,
			})
			.from(order)
			.where(eq(order.userId, currentUser.id));

		const stats = {
			totalOrders: orders.length,
			pendingOrders: orders.filter((o) => o.status === "pending").length,
			processingOrders: orders.filter((o) => o.status === "processing").length,
			completedOrders: orders.filter((o) => o.status === "completed").length,
			cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
			totalRevenue: orders
				.filter((o) => o.status === "completed")
				.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0),
		};

		return { data: stats };
	} catch (error) {
		console.error("Erro ao buscar estatísticas dos pedidos:", error);
		return { error: "Erro interno do servidor" };
	}
}
