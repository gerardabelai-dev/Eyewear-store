import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import z from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";

const updateOrderCustomerIdSchema = z.object({
	orderId: z.string(),
	customerId: z.string(),
});

export async function POST(request: Request) {
	const body = await request.json();

	const { success, error, data } = updateOrderCustomerIdSchema.safeParse(body);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { orderId, customerId } = data;

	const orderFound = await db.query.order.findFirst({
		where: eq(order.id, orderId),
	});

	if (!orderFound) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.ORDER_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	if (orderFound.customerId) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.ORDER_ALREADY_HAS_CUSTOMER),
			{
				status: HTTP_CODES.BAD_REQUEST,
			},
		);
	}

	const [orderUpdated] = await db
		.update(order)
		.set({
			customerId,
			updatedAt: new Date(),
		})
		.where(eq(order.id, orderId))
		.returning();

	if (!orderUpdated) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_UPDATE_ORDER),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}

	return NextResponse.json({
		order: orderUpdated,
	});
}
