import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { cart, cartProduct } from "@/lib/db/schema";

const removeProductFromCartParamsSchema = z.object({
	cartId: z.string(),
});

const removeProductFromCartBodySchema = z.object({
	productId: z.string(),
});

type RemoveProductFromCartParams = z.infer<
	typeof removeProductFromCartParamsSchema
>;

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<RemoveProductFromCartParams> },
) {
	const {
		success: paramsSuccess,
		error: paramsError,
		data: paramsData,
	} = removeProductFromCartParamsSchema.safeParse(await params);

	if (!paramsSuccess) {
		return mapInvalidZodResponse(paramsError);
	}

	const body = await request.json();
	const {
		success: bodySuccess,
		error: bodyError,
		data: bodyData,
	} = removeProductFromCartBodySchema.safeParse(body);

	if (!bodySuccess) {
		return mapInvalidZodResponse(bodyError);
	}

	const { cartId } = paramsData;
	const { productId } = bodyData;

	try {
		// Check if cart exists
		const cartFound = await db.query.cart.findFirst({
			where: eq(cart.id, cartId),
		});

		if (!cartFound) {
			return Response.json(mapErrorCodes(ERROR_CODES.CART_NOT_FOUND), {
				status: HTTP_CODES.NOT_FOUND,
			});
		}

		// Check if product exists in cart
		const existingCartProduct = await db.query.cartProduct.findFirst({
			where: and(
				eq(cartProduct.cartId, cartId),
				eq(cartProduct.productId, productId),
			),
		});

		if (!existingCartProduct) {
			return Response.json(mapErrorCodes(ERROR_CODES.PRODUCT_NOT_FOUND), {
				status: HTTP_CODES.NOT_FOUND,
			});
		}

		// Remove product from cart
		await db
			.delete(cartProduct)
			.where(
				and(
					eq(cartProduct.cartId, cartId),
					eq(cartProduct.productId, productId),
				),
			);

		return NextResponse.json({
			success: true,
			message: "Product removed from cart successfully",
		});
	} catch (error) {
		console.error("Error removing product from cart:", error);
		return Response.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_REMOVE_PRODUCT_FROM_CART),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}
}
