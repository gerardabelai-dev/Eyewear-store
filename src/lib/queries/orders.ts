import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { order, orderItem, orderStatus, product } from "@/lib/db/schema";

export async function getOrdersQuery(
	userId: string,
	{ page = 1, limit = 10 } = {},
) {
	return db
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
		.orderBy(desc(order.createdAt))
		.limit(limit)
		.offset((page - 1) * limit);
}

export async function getOrderByIdQuery(orderId: string, userId: string) {
	const orderData = await db
		.select({ id: order.id /* other fields */ })
		.from(order)
		.leftJoin(orderStatus, eq(order.statusId, orderStatus.id))
		.where(and(eq(order.id, orderId), eq(order.userId, userId)))
		.limit(1);
	if (!orderData.length) throw new Error("Order not found");
	const items = await db
		.select({
			/* fields */
		})
		.from(orderItem)
		.leftJoin(product, eq(orderItem.productId, product.id)) /* other joins */
		.where(eq(orderItem.orderId, orderId));
	return { ...orderData[0], items };
}

export async function getOrderStatsQuery(userId: string) {
	const orders = await db
		.select({
			statusId: order.statusId,
			totalAmount: order.totalAmount,
			createdAt: order.createdAt,
		})
		.from(order)
		.leftJoin(orderStatus, eq(order.statusId, orderStatus.id))
		.where(eq(order.userId, userId));

	// Calculate statistics
	const totalOrders = orders.length;
	const totalRevenue = orders.reduce(
		(acc, order) => acc + parseFloat(order.totalAmount.toString()),
		0,
	);

	// Note: These status counts would need actual status IDs from your database
	// For now, using placeholder logic - you should replace with actual status IDs
	const pendingOrders = orders.filter((o) => o.statusId === "pending").length;
	const processingOrders = orders.filter(
		(o) => o.statusId === "processing",
	).length;
	const completedOrders = orders.filter(
		(o) => o.statusId === "completed",
	).length;
	const cancelledOrders = orders.filter(
		(o) => o.statusId === "cancelled",
	).length;

	return {
		totalOrders,
		pendingOrders,
		processingOrders,
		completedOrders,
		cancelledOrders,
		totalRevenue,
	};
}
