import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { badRequestResponse } from "@/app/api/utils/bad-request-response";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { db } from "@/lib/db";
import { cart, order } from "@/lib/db/schema";

const createOrderFromCartIdSchema = z.object({
	cartId: z.string(),
});

export async function POST(request: Request) {
	const body = await request.json();

	const { success, error, data } = createOrderFromCartIdSchema.safeParse(body);

	if (!success) {
		return badRequestResponse(error);
	}

	const { cartId } = data;

	const cartFound = await db.query.cart.findFirst({
		where: eq(cart.id, cartId),
	});

	if (!cartFound) {
		return Response.json(mapErrorCodes(ERROR_CODES.CART_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	const [orderCreated] = await db
		.insert(order)
		.values({
			cartId: cartId,
		})
		.returning();

	if (!orderCreated) {
		return Response.json(mapErrorCodes(ERROR_CODES.ORDER_NOT_CREATED), {
			status: HTTP_CODES.INTERNAL_SERVER_ERROR,
		});
	}

	return NextResponse.json(orderCreated);
}
