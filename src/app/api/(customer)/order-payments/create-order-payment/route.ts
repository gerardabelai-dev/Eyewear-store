import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import z from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { order, orderPayment, orderPaymentMethod } from "@/lib/db/schema";

const createOrderPaymentSchema = z.object({
	orderId: z.string(),
	orderPaymentMethodId: z.string(),
	stripePaymentMethodId: z.string().optional(),
});

export async function POST(request: Request) {
	const body = await request.json();
	console.log("📥 Received order payment request:", body);

	const { success, error, data } = createOrderPaymentSchema.safeParse(body);

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

	const orderFound = await db.query.order.findFirst({
		where: eq(order.id, orderId),
	});

	if (!orderFound) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.ORDER_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	const orderPaymentFound = await db.query.orderPayment.findFirst({
		where: eq(orderPayment.orderId, orderId),
	});

	const orderPaymentMethodFound = await db.query.orderPaymentMethod.findFirst({
		where: eq(orderPaymentMethod.id, orderPaymentMethodId),
	});

	if (!orderPaymentMethodFound) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.ORDER_PAYMENT_METHODS_NOT_FOUND),
			{
				status: HTTP_CODES.NOT_FOUND,
			},
		);
	}

	let orderPaymentResult: any;

	if (orderPaymentFound) {
		// Update existing order payment
		console.log("🔄 Updating existing order payment:", {
			id: orderPaymentFound.id,
			orderPaymentMethodId,
			stripePaymentMethodId,
		});

		const [updatedOrderPayment] = await db
			.update(orderPayment)
			.set({
				orderPaymentMethodId,
				stripePaymentMethodId,
				updatedAt: new Date(),
			})
			.where(eq(orderPayment.id, orderPaymentFound.id))
			.returning();

		console.log("✅ Updated order payment result:", updatedOrderPayment);
		orderPaymentResult = updatedOrderPayment;
	} else {
		// Create new order payment
		const [createdOrderPayment] = await db
			.insert(orderPayment)
			.values({
				orderId,
				orderPaymentMethodId,
				stripePaymentMethodId,
			})
			.returning();

		orderPaymentResult = createdOrderPayment;
	}

	if (!orderPaymentResult) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_ORDER_PAYMENT),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}

	return NextResponse.json({
		orderPayment: orderPaymentResult,
	});
}
