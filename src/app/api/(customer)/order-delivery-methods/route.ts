import { NextResponse } from "next/server";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { db } from "@/lib/db";

export async function GET(_request: Request) {
	const orderDeliveryMethodsFound =
		await db.query.orderDeliveryMethod.findMany();

	if (!orderDeliveryMethodsFound) {
		return Response.json(
			mapErrorCodes(ERROR_CODES.ORDER_DELIVERY_METHODS_NOT_FOUND),
			{
				status: HTTP_CODES.NOT_FOUND,
			},
		);
	}

	return NextResponse.json({
		orderDeliveryMethods: orderDeliveryMethodsFound,
	});
}
