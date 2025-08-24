import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import z from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { order, orderPayment, orderPaymentMethod } from "@/lib/db/schema";

const updateOrderPaymentSchema = z.object({
	orderId: z.string(),
	orderPaymentMethodId: z.string(),
	stripePaymentMethodId: z.string().optional(),
});

export async function PATCH(request: Request) {
	const body = await request.json();
	console.log("📥 Received order payment update request:", body);

	const { success, error, data } = updateOrderPaymentSchema.safeParse(body);

	if (!success) {
		console.log("❌ Validation failed:", error);
		return mapInvalidZodResponse(error);
	}

	const { orderId, orderPaymentMethodId, stripePaymentMethodId } = data;
	console.log("✅ Parsed data:", {
		orderId,
		orderPaymentMethodId,
		stripePaymentMethodId,
	});

	try {
		// Check if order exists
		const orderFound = await db.query.order.findFirst({
			where: eq(order.id, orderId),
		});

		if (!orderFound) {
			return NextResponse.json(mapErrorCodes(ERROR_CODES.ORDER_NOT_FOUND), {
				status: HTTP_CODES.NOT_FOUND,
			});
		}

		// Check if payment method exists
		const orderPaymentMethodFound = await db.query.orderPaymentMethod.findFirst(
			{
				where: eq(orderPaymentMethod.id, orderPaymentMethodId),
			},
		);

		if (!orderPaymentMethodFound) {
			return NextResponse.json(
				mapErrorCodes(ERROR_CODES.ORDER_PAYMENT_METHODS_NOT_FOUND),
				{
					status: HTTP_CODES.NOT_FOUND,
				},
			);
		}

		// Check if order payment exists
		const existingOrderPayment = await db.query.orderPayment.findFirst({
			where: eq(orderPayment.orderId, orderId),
		});

		let updatedOrderPayment: typeof orderPayment.$inferSelect;

		if (existingOrderPayment) {
			// Update existing order payment
			console.log("🔄 Updating existing order payment:", {
				id: existingOrderPayment.id,
				orderPaymentMethodId,
				stripePaymentMethodId,
			});

			const [updated] = await db
				.update(orderPayment)
				.set({
					orderPaymentMethodId,
					stripePaymentMethodId,
					updatedAt: new Date(),
				})
				.where(eq(orderPayment.orderId, orderId))
				.returning();

			updatedOrderPayment = updated;
		} else {
			// Create new order payment if it doesn't exist
			console.log("➕ Creating new order payment");

			const [created] = await db
				.insert(orderPayment)
				.values({
					orderId,
					orderPaymentMethodId,
					stripePaymentMethodId,
					totalPriceInCents: 0, // Will be calculated later
				})
				.returning();

			updatedOrderPayment = created;
		}

		if (!updatedOrderPayment) {
			return NextResponse.json(
				mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_ORDER_PAYMENT),
				{
					status: HTTP_CODES.INTERNAL_SERVER_ERROR,
				},
			);
		}

		console.log("✅ Order payment result:", updatedOrderPayment);

		return NextResponse.json({
			orderPayment: updatedOrderPayment,
		});
	} catch (error) {
		console.error("Error updating order payment:", error);
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_ORDER_PAYMENT),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}
}
