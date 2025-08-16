import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { orderDelivery } from "@/lib/db/schema";

const getOrderDeliverySchema = z.object({
	orderId: z.string(),
});
type GetOrderDeliveryResponse = z.infer<typeof getOrderDeliverySchema>;

export async function GET(
	_request: Request,
	{ params }: { params: Promise<GetOrderDeliveryResponse> },
) {
	const { success, error, data } = getOrderDeliverySchema.safeParse(
		await params,
	);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { orderId } = data;

	const orderDeliveryFound = await db.query.orderDelivery.findFirst({
		where: eq(orderDelivery.orderId, orderId),
		with: {
			order: true,
			orderDeliveryMethod: true,
		},
	});

	if (!orderDeliveryFound) {
		return Response.json(mapErrorCodes(ERROR_CODES.ORDER_DELIVERY_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	return NextResponse.json({
		orderDelivery: orderDeliveryFound,
	});
}
