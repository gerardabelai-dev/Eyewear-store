import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { order, orderPayment } from "@/lib/db/schema";

const updatePaymentStatusSchema = z.object({
	paymentIntentId: z.string(),
	status: z.enum(["pending", "paid", "failed"]),
});

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ orderId: string }> },
) {
	const body = await request.json();
	const { orderId } = await params;

	console.log("📥 Update payment status request:", { orderId, body });

	const { success, error, data } = updatePaymentStatusSchema.safeParse(body);

	if (!success) {
		console.log("❌ Validation failed:", error);
		return mapInvalidZodResponse(error);
	}

	const { paymentIntentId, status } = data;
	console.log("✅ Parsed data:", { orderId, paymentIntentId, status });

	// Find the order
	const orderFound = await db.query.order.findFirst({
		where: eq(order.id, orderId),
	});

	if (!orderFound) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.ORDER_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	// Find the specific payment record that matches the paymentIntentId
	const paymentFound = await db.query.orderPayment.findFirst({
		where: (orderPayment, { and, eq }) =>
			and(
				eq(orderPayment.orderId, orderId),
				eq(orderPayment.stripePaymentIntentId, paymentIntentId),
			),
	});

	if (!paymentFound) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.ORDER_PAYMENT_NOT_FOUND),
			{
				status: HTTP_CODES.NOT_FOUND,
			},
		);
	}

	// Update the order payment status
	console.log("🔄 Updating payment status:", {
		paymentId: paymentFound.id,
		paymentIntentId: paymentFound.stripePaymentIntentId,
		currentStatus: paymentFound.orderPaymentStatus,
		newStatus: status,
	});

	const [updatedOrderPayment] = await db
		.update(orderPayment)
		.set({
			orderPaymentStatus: status,
			updatedAt: new Date(),
		})
		.where(eq(orderPayment.id, paymentFound.id))
		.returning();

	console.log("✅ Payment status updated:", updatedOrderPayment);

	if (!updatedOrderPayment) {
		console.error("❌ Failed to update payment status");
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_UPDATE_ORDER_PAYMENT),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}

	return NextResponse.json({
		orderPayment: updatedOrderPayment,
	});
}
