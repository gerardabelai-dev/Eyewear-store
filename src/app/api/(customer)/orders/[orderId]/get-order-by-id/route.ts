import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";

const getOrderByIdSchema = z.object({
	orderId: z.string(),
});
type GetOrderByIdResponse = z.infer<typeof getOrderByIdSchema>;

export async function GET(
	_request: Request,
	{ params }: { params: Promise<GetOrderByIdResponse> },
) {
	const { success, error, data } = getOrderByIdSchema.safeParse(await params);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { orderId } = data;

	const orderFound = await db.query.order.findFirst({
		where: eq(order.id, orderId),
		with: {
			customer: {
				with: {
					user: true,
				},
			},
			customerAddress: true,
			cart: {
				with: {
					cartProducts: {
						with: {
							product: {
								with: {
									productPrice: true,
									images: true,
								},
							},
						},
					},
				},
			},
			delivery: {
				with: {
					orderDeliveryMethod: true,
				},
			},
			payment: {
				with: {
					orderPaymentMethod: true,
				},
			},
		},
	});

	if (!orderFound) {
		return Response.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_GET_ORDER_DETAILS),
			{
				status: HTTP_CODES.NOT_FOUND,
			},
		);
	}

	return NextResponse.json({
		order: orderFound,
	});
}
