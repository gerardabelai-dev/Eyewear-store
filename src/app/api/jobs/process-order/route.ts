import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order, user } from "@/lib/db/schema";
import type { ProcessOrderPayload } from "@/lib/qstash";
import { enqueueJob, verifyQStashSignature } from "@/lib/qstash";

export async function POST(request: NextRequest) {
	try {
		// Get the request body and signature
		const body = await request.text();
		const signature = request.headers.get("upstash-signature");
		const url = request.url;

		// Verify QStash signature
		if (!signature) {
			console.error("Missing QStash signature");
			return NextResponse.json({ error: "Missing signature" }, { status: 401 });
		}

		const isValid = await verifyQStashSignature(signature, body, url);
		if (!isValid) {
			console.error("Invalid QStash signature");
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		// Parse the payload
		let payload: ProcessOrderPayload;
		try {
			payload = JSON.parse(body);
		} catch (error) {
			console.error("Invalid JSON payload:", error);
			return NextResponse.json(
				{ error: "Invalid JSON payload" },
				{ status: 400 },
			);
		}

		// Validate required fields
		if (!payload.orderId || !payload.userId) {
			console.error("Missing required fields in payload:", payload);
			return NextResponse.json(
				{ error: "Missing required fields: orderId, userId" },
				{ status: 400 },
			);
		}

		console.log(
			`Processing order ${payload.orderId} for user ${payload.userId}`,
		);

		// Get the order and user details
		const [orderRecord] = await db
			.select({
				id: order.id,
				status: order.status,
				total: order.totalAmount,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
				},
			})
			.from(order)
			.innerJoin(user, eq(order.userId, user.id))
			.where(
				and(eq(order.id, payload.orderId), eq(order.userId, payload.userId)),
			);

		if (!orderRecord) {
			console.error(
				`Order ${payload.orderId} not found for user ${payload.userId}`,
			);
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		// Update order status to processing
		await db
			.update(order)
			.set({
				status: "processing",
				updatedAt: new Date(),
			})
			.where(eq(order.id, payload.orderId));

		console.log(`Order ${payload.orderId} status updated to processing`);

		// Enqueue order confirmation email
		try {
			await enqueueJob("send-order-confirmation", {
				orderId: orderRecord.id,
				userId: orderRecord.user.id,
				email: orderRecord.user.email,
				orderDetails: {
					total: Number(orderRecord.total),
					items: [], // Order items would need to be fetched separately from orderItem table
				},
			});

			console.log(
				`Order confirmation email queued for order ${payload.orderId}`,
			);
		} catch (emailError) {
			console.error(
				`Failed to queue order confirmation email for order ${payload.orderId}:`,
				emailError,
			);
			// Don't fail the order processing if email queueing fails
		}

		// Additional order processing logic can be added here
		// For example: inventory updates, payment processing, etc.

		return NextResponse.json({
			success: true,
			orderId: payload.orderId,
			userId: payload.userId,
			status: "processing",
			message: "Order processed successfully",
		});
	} catch (error) {
		console.error("Error in process-order job:", error);

		// Try to update order status to failed if we have the orderId
		try {
			const payload: ProcessOrderPayload = JSON.parse(
				await request.clone().text(),
			);
			if (payload.orderId) {
				await db
					.update(order)
					.set({
						status: "failed",
						updatedAt: new Date(),
					})
					.where(eq(order.id, payload.orderId));
			}
		} catch (updateError) {
			console.error("Failed to update order status to failed:", updateError);
		}

		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
