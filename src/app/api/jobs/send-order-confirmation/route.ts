import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";
import type { SendOrderConfirmationPayload } from "@/lib/qstash";
import { verifyQStashSignature } from "@/lib/qstash";
import { sendOrderConfirmationEmail } from "@/lib/resend";

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
		let payload: SendOrderConfirmationPayload;
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
		if (
			!payload.email ||
			!payload.orderId ||
			!payload.userId ||
			!payload.orderDetails
		) {
			console.error("Missing required fields in payload:", payload);
			return NextResponse.json(
				{
					error:
						"Missing required fields: email, orderId, userId, orderDetails",
				},
				{ status: 400 },
			);
		}

		// Validate order details structure
		if (
			!payload.orderDetails.total ||
			!Array.isArray(payload.orderDetails.items)
		) {
			console.error("Invalid order details structure:", payload.orderDetails);
			return NextResponse.json(
				{ error: "Invalid order details: total and items array required" },
				{ status: 400 },
			);
		}

		// Fetch order details from database to get orderNumber and customerName
		const [orderRecord] = await db
			.select({
				orderNumber: order.orderNumber,
				customerName: order.customerName,
			})
			.from(order)
			.where(eq(order.id, payload.orderId));

		if (!orderRecord) {
			console.error(`Order ${payload.orderId} not found`);
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		// Send the order confirmation email
		console.log(
			`Sending order confirmation email to ${payload.email} for order ${payload.orderId}`,
		);

		const result = await sendOrderConfirmationEmail(
			{
				orderNumber: orderRecord.orderNumber,
				customerName: orderRecord.customerName,
				total: payload.orderDetails.total,
				items: payload.orderDetails.items,
				unsubscribeUrl: payload.unsubscribeUrl,
			},
			payload.email,
		);

		console.log(
			`Order confirmation email sent successfully to ${payload.email}:`,
			result.data,
		);

		return NextResponse.json({
			success: true,
			messageId: result.messageId,
			orderId: payload.orderId,
			userId: payload.userId,
		});
	} catch (error) {
		console.error("Error in send-order-confirmation job:", error);

		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
