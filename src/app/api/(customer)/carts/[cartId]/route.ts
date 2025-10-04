import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { cart, cartProduct } from "@/lib/db/schema";

const getCartByIdSchema = z.object({
	cartId: z.string(),
});
type GetCartByIdResponse = z.infer<typeof getCartByIdSchema>;

export async function GET(
	_request: Request,
	{ params }: { params: Promise<GetCartByIdResponse> },
) {
	const { success, error, data } = getCartByIdSchema.safeParse(await params);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { cartId } = data;

	const cartFound = await db.query.cart.findFirst({
		where: eq(cart.id, cartId),
		with: {
			cartProducts: {
				orderBy: [asc(cartProduct.createdAt)],
				with: {
					product: {
						with: {
							productPrice: true,
							images: true,
						},
					},
					productPrice: true,
				},
			},
		},
	});

	if (!cartFound) {
		return Response.json(mapErrorCodes(ERROR_CODES.CART_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	return NextResponse.json({
		id: cartFound.id,
		items: cartFound.cartProducts,
		createdAt: cartFound.createdAt,
		updatedAt: cartFound.updatedAt,
	});
}
