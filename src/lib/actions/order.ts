"use server";

import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";
import { getDefaultOrderStatus } from "@/lib/actions/order-status";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import {
	category,
	order,
	orderItem,
	orderStatus,
	product,
	subcategory,
	user,
} from "@/lib/db/schema";
import { enqueueEmailJob } from "@/lib/qstash";

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
	statusId: z.string().optional(),
});

const updateOrderStatusSchema = z.object({
	id: z.string().min(1, "ID do pedido é obrigatório"),
	statusId: z.string().min(1, "Status é obrigatório"),
});

const updateOrderSchema = z.object({
	id: z.string().min(1, "ID do pedido é obrigatório"),
	customerName: z.string().min(1, "Nome do cliente é obrigatório"),
	customerEmail: z.string().email("E-mail inválido"),
	customerPhone: z.string().optional(),
	notes: z.string().optional(),
	items: z.array(orderItemSchema).min(1, "Pelo menos um item é obrigatório"),
	statusId: z.string().min(1, "Status é obrigatório").optional(),
});

// Generate order number
function generateOrderNumber(): string {
	const timestamp = Date.now().toString();
	const random = Math.random().toString(36).substring(2, 8).toUpperCase();
	return `PED-${timestamp.slice(-6)}${random}`;
}

// Internal function to get orders
async function _getOrdersInternal(userId: string) {
	const orders = await db
		.select({
			id: order.id,
			orderNumber: order.orderNumber,
			userId: order.userId,
			customerName: order.customerName,
			customerEmail: order.customerEmail,
			customerPhone: order.customerPhone,
			statusId: order.statusId,
			statusName: orderStatus.name,
			statusColor: orderStatus.color,
			totalAmount: order.totalAmount,
			notes: order.notes,
			createdAt: order.createdAt,
			updatedAt: order.updatedAt,
		})
		.from(order)
		.leftJoin(orderStatus, eq(order.statusId, orderStatus.id))
		.where(eq(order.userId, userId))
		.orderBy(desc(order.createdAt));

	return orders;
}

// Get all orders with details
export async function getOrders() {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		// Use unstable_cache with a more predictable approach
		const getCachedOrders = unstable_cache(
			async (userId: string) => _getOrdersInternal(userId),
			["user-orders"],
			{
				revalidate: 60, // Cache for 60 seconds
				tags: ["orders"],
			},
		);

		const orders = await getCachedOrders(currentUser.id);
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
				statusId: order.statusId,
				statusName: orderStatus.name,
				statusColor: orderStatus.color,
				totalAmount: order.totalAmount,
				notes: order.notes,
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
			})
			.from(order)
			.leftJoin(orderStatus, eq(order.statusId, orderStatus.id))
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

		// Use provided status or get default
		let statusId = validatedData.statusId;

		if (!statusId) {
			const defaultStatusResult = await getDefaultOrderStatus();
			if (defaultStatusResult.error || !defaultStatusResult.data) {
				return { error: "Erro ao buscar status padrão" };
			}
			statusId = defaultStatusResult.data.id;
		}

		// Validate products exist and have sufficient stock
		const productIds = validatedData.items.map((item) => item.productId);
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
				statusId: statusId,
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

		// Reduce stock for each item
		for (const item of validatedData.items) {
			await db
				.update(product)
				.set({
					stock: sql`${product.stock} - ${item.quantity}`,
					updatedAt: new Date(),
				})
				.where(eq(product.id, item.productId));
		}

		// Queue order confirmation email
		try {
			await enqueueEmailJob({
				type: "order-confirmation",
				userId: currentUser.id,
				email: validatedData.customerEmail,
				data: {
					orderNumber: newOrder[0].orderNumber,
					customerName: validatedData.customerName,
					totalAmount: totalAmount,
					items: validatedData.items.map((item) => {
						const productData = productsMap.get(item.productId);
						return {
							productName: productData?.name || "Produto",
							quantity: item.quantity,
							unitPrice: item.unitPrice,
							totalPrice: (
								parseFloat(item.unitPrice) * item.quantity
							).toString(),
						};
					}),
				},
			});
		} catch (emailError) {
			console.error("Erro ao enviar email de confirmação:", emailError);
			// Don't fail the order creation if email fails
		}

		revalidateTag("orders");
		revalidatePath("/pedidos");
		return { success: "Pedido criado com sucesso!" };
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Erro ao criar pedido:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Update order
export async function updateOrder(data: z.infer<typeof updateOrderSchema>) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const validatedData = updateOrderSchema.parse(data);

		// Get existing order
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

		// Validate products exist and have sufficient stock
		const productIds = validatedData.items.map((item) => item.productId);
		const allProducts = await db.select().from(product);
		const productsMap = new Map(allProducts.map((p) => [p.id, p]));

		// Get existing order items to restore stock
		const existingItems = await db
			.select()
			.from(orderItem)
			.where(eq(orderItem.orderId, validatedData.id));

		// Calculate stock changes
		const stockChanges = new Map<string, number>();

		// Restore stock from existing items
		for (const item of existingItems) {
			stockChanges.set(
				item.productId,
				(stockChanges.get(item.productId) || 0) + item.quantity,
			);
		}

		// Subtract stock for new items
		for (const item of validatedData.items) {
			stockChanges.set(
				item.productId,
				(stockChanges.get(item.productId) || 0) - item.quantity,
			);
		}

		// Validate stock availability
		for (const [productId, stockChange] of stockChanges) {
			const productData = productsMap.get(productId);
			if (!productData) {
				return { error: `Produto ${productId} não encontrado` };
			}
			if (productData.stock + stockChange < 0) {
				return {
					error: `Estoque insuficiente para o produto ${productData.name}`,
				};
			}
		}

		// Calculate total amount
		const totalAmount = validatedData.items.reduce((sum, item) => {
			return sum + parseFloat(item.unitPrice) * item.quantity;
		}, 0);

		// Update order
		await db
			.update(order)
			.set({
				customerName: validatedData.customerName,
				customerEmail: validatedData.customerEmail,
				customerPhone: validatedData.customerPhone || null,
				statusId: validatedData.statusId || existingOrder[0].statusId,
				totalAmount: totalAmount.toString(),
				notes: validatedData.notes || null,
				updatedAt: new Date(),
			})
			.where(eq(order.id, validatedData.id));

		// Delete existing order items
		await db.delete(orderItem).where(eq(orderItem.orderId, validatedData.id));

		// Create new order items
		const newOrderItems = validatedData.items.map((item) => ({
			id: crypto.randomUUID(),
			orderId: validatedData.id,
			productId: item.productId,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			totalPrice: (parseFloat(item.unitPrice) * item.quantity).toString(),
			createdAt: new Date(),
			updatedAt: new Date(),
		}));

		await db.insert(orderItem).values(newOrderItems);

		// Update stock for all affected products
		for (const [productId, stockChange] of stockChanges) {
			if (stockChange !== 0) {
				await db
					.update(product)
					.set({
						stock: sql`${product.stock} + ${stockChange}`,
						updatedAt: new Date(),
					})
					.where(eq(product.id, productId));
			}
		}

		// Queue order update email if status changed
		if (
			validatedData.statusId &&
			validatedData.statusId !== existingOrder[0].statusId
		) {
			try {
				const statusData = await db
					.select()
					.from(orderStatus)
					.where(eq(orderStatus.id, validatedData.statusId))
					.limit(1);

				if (statusData.length > 0) {
					await enqueueEmailJob({
						type: "order-update",
						userId: currentUser.id,
						email: validatedData.customerEmail,
						data: {
							orderNumber: existingOrder[0].orderNumber,
							customerName: validatedData.customerName,
							newStatus: statusData[0].name,
							totalAmount: totalAmount,
						},
					});
				}
			} catch (emailError) {
				console.error("Erro ao enviar email de atualização:", emailError);
				// Don't fail the order update if email fails
			}
		}

		revalidateTag("orders");
		revalidatePath("/pedidos");
		return { success: "Pedido atualizado com sucesso!" };
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Erro ao atualizar pedido:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Update order status only
export async function updateOrderStatus(
	data: z.infer<typeof updateOrderStatusSchema>,
) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const validatedData = updateOrderStatusSchema.parse(data);

		// Get existing order
		const existingOrder = await db
			.select({
				id: order.id,
				orderNumber: order.orderNumber,
				customerName: order.customerName,
				customerEmail: order.customerEmail,
				statusId: order.statusId,
				totalAmount: order.totalAmount,
			})
			.from(order)
			.where(
				and(eq(order.id, validatedData.id), eq(order.userId, currentUser.id)),
			)
			.limit(1);

		if (!existingOrder.length) {
			return { error: "Pedido não encontrado" };
		}

		const currentOrder = existingOrder[0];

		// Update order status
		await db
			.update(order)
			.set({
				statusId: validatedData.statusId,
				updatedAt: new Date(),
			})
			.where(eq(order.id, validatedData.id));

		// Queue order update email if status changed
		if (validatedData.statusId !== currentOrder.statusId) {
			try {
				const statusData = await db
					.select()
					.from(orderStatus)
					.where(eq(orderStatus.id, validatedData.statusId))
					.limit(1);

				if (statusData.length > 0) {
					await enqueueEmailJob({
						type: "order-update",
						userId: currentUser.id,
						email: currentOrder.customerEmail,
						data: {
							orderNumber: currentOrder.orderNumber,
							customerName: currentOrder.customerName,
							newStatus: statusData[0].name,
							totalAmount: parseFloat(currentOrder.totalAmount),
						},
					});
				}
			} catch (emailError) {
				console.error("Erro ao enviar email de atualização:", emailError);
				// Don't fail the status update if email fails
			}
		}

		revalidateTag("orders");
		revalidatePath("/pedidos");
		return { success: "Status do pedido atualizado com sucesso!" };
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Erro ao atualizar status do pedido:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Delete order
export async function deleteOrder(orderId: string) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		// Get order items to restore stock
		const orderItems = await db
			.select()
			.from(orderItem)
			.where(eq(orderItem.orderId, orderId));

		// Delete order items first
		await db.delete(orderItem).where(eq(orderItem.orderId, orderId));

		// Delete order
		const result = await db
			.delete(order)
			.where(and(eq(order.id, orderId), eq(order.userId, currentUser.id)))
			.returning();

		if (!result.length) {
			return { error: "Pedido não encontrado" };
		}

		// Restore stock for all items
		for (const item of orderItems) {
			await db
				.update(product)
				.set({
					stock: sql`${product.stock} + ${item.quantity}`,
					updatedAt: new Date(),
				})
				.where(eq(product.id, item.productId));
		}

		revalidateTag("orders");
		revalidatePath("/pedidos");
		return { success: "Pedido deletado com sucesso!" };
	} catch (error) {
		console.error("Erro ao deletar pedido:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Internal function to get order stats
async function _getOrderStatsInternal(userId: string) {
	const orders = await db
		.select({
			statusId: order.statusId,
			totalAmount: order.totalAmount,
			createdAt: order.createdAt,
		})
		.from(order)
		.where(eq(order.userId, userId));

	const stats = {
		totalOrders: orders.length,
		pendingOrders: orders.filter((o) => o.statusId === "pending").length,
		processingOrders: orders.filter((o) => o.statusId === "processing").length,
		completedOrders: orders.filter((o) => o.statusId === "completed").length,
		cancelledOrders: orders.filter((o) => o.statusId === "cancelled").length,
		totalRevenue: orders
			.filter((o) => o.statusId === "completed")
			.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0),
	};

	return stats;
}

// Get order statistics
export async function getOrderStats() {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		// Use unstable_cache with a more predictable approach
		const getCachedOrderStats = unstable_cache(
			async (userId: string) => _getOrderStatsInternal(userId),
			["user-order-stats"],
			{
				revalidate: 60, // Cache for 60 seconds
				tags: ["orders"],
			},
		);

		const stats = await getCachedOrderStats(currentUser.id);
		return { data: stats };
	} catch (error) {
		console.error("Erro ao buscar estatísticas dos pedidos:", error);
		return { error: "Erro interno do servidor" };
	}
}
