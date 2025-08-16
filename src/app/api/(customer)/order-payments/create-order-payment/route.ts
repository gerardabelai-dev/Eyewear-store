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
});

export async function POST(request: Request) {
	const body = await request.json();

	const { success, error, data } = createOrderPaymentSchema.safeParse(body);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { orderId, orderPaymentMethodId } = data;

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

	if (orderPaymentFound) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.ORDER_ALREADY_HAS_PAYMENT_METHOD),
			{
				status: HTTP_CODES.BAD_REQUEST,
			},
		);
	}

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

	const [orderPaymentCreated] = await db
		.insert(orderPayment)
		.values({
			orderId,
			orderPaymentMethodId,
		})
		.returning();

	if (!orderPaymentCreated) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_ORDER_PAYMENT),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}

	return NextResponse.json({
		orderPayment: orderPaymentCreated,
	});
}
