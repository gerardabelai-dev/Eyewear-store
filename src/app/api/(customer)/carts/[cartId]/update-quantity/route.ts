import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { cart, cartProduct, product } from "@/lib/db/schema";

const updateCartProductQuantityParamsSchema = z.object({
	cartId: z.string(),
});

const updateCartProductQuantityBodySchema = z.object({
	productId: z.string(),
	quantity: z.number().int().positive(),
});

type UpdateCartProductQuantityParams = z.infer<
	typeof updateCartProductQuantityParamsSchema
>;

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<UpdateCartProductQuantityParams> },
) {
	const {
		success: paramsSuccess,
		error: paramsError,
		data: paramsData,
	} = updateCartProductQuantityParamsSchema.safeParse(await params);

	if (!paramsSuccess) {
		return mapInvalidZodResponse(paramsError);
	}

	const body = await request.json();
	const {
		success: bodySuccess,
		error: bodyError,
		data: bodyData,
	} = updateCartProductQuantityBodySchema.safeParse(body);

	if (!bodySuccess) {
		return mapInvalidZodResponse(bodyError);
	}

	const { cartId } = paramsData;
	const { productId, quantity } = bodyData;

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

		// Check if product exists and has sufficient stock
		const productFound = await db.query.product.findFirst({
			where: eq(product.id, productId),
		});

		if (!productFound) {
			return Response.json(mapErrorCodes(ERROR_CODES.PRODUCT_NOT_FOUND), {
				status: HTTP_CODES.NOT_FOUND,
			});
		}

		// Check if requested quantity exceeds available stock
		if (quantity > productFound.stock) {
			return Response.json(mapErrorCodes(ERROR_CODES.INSUFFICIENT_STOCK), {
				status: HTTP_CODES.BAD_REQUEST,
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

		// Update cart product quantity
		const [updatedCartProduct] = await db
			.update(cartProduct)
			.set({
				quantity,
				updatedAt: new Date(),
			})
			.where(eq(cartProduct.id, existingCartProduct.id))
			.returning();

		if (!updatedCartProduct) {
			return Response.json(
				mapErrorCodes(ERROR_CODES.FAILED_TO_UPDATE_CART_PRODUCT_QUANTITY),
				{
					status: HTTP_CODES.INTERNAL_SERVER_ERROR,
				},
			);
		}

		return NextResponse.json({
			cartProduct: updatedCartProduct,
		});
	} catch (error) {
		console.error("Error updating cart product quantity:", error);
		return Response.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_UPDATE_CART_PRODUCT_QUANTITY),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}
}
