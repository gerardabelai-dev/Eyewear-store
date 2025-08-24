import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { cart, order, orderDelivery, orderPayment } from "@/lib/db/schema";

const createOrderFromCartIdSchema = z.object({
	cartId: z.string(),
});

export async function POST(request: Request) {
	const body = await request.json();

	const { success, error, data } = createOrderFromCartIdSchema.safeParse(body);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { cartId } = data;

	const cartFound = await db.query.cart.findFirst({
		where: eq(cart.id, cartId),
		with: {
			cartProducts: {
				with: {
					product: true,
				},
			},
		},
	});

	if (!cartFound) {
		return Response.json(mapErrorCodes(ERROR_CODES.CART_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	// Validate stock for all cart items
	for (const cartProduct of cartFound.cartProducts) {
		if (cartProduct.quantity > cartProduct.product.stock) {
			return Response.json(mapErrorCodes(ERROR_CODES.INSUFFICIENT_STOCK), {
				status: HTTP_CODES.BAD_REQUEST,
			});
		}
	}

	// Get the first available delivery method and payment method to create defaults
	const [deliveryMethods, paymentMethods] = await Promise.all([
		db.query.orderDeliveryMethod.findMany({ limit: 1 }),
		db.query.orderPaymentMethod.findMany({ limit: 1 }),
	]);

	const [orderCreated] = await db
		.insert(order)
		.values({
			cartId: cartId,
		})
		.returning();

	if (!orderCreated) {
		return Response.json(mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_ORDER), {
			status: HTTP_CODES.INTERNAL_SERVER_ERROR,
		});
	}

	// Create a default order delivery with the first available delivery method
	if (deliveryMethods.length > 0) {
		try {
			await db.insert(orderDelivery).values({
				orderId: orderCreated.id,
				orderDeliveryMethodId: deliveryMethods[0].id,
			});
		} catch (error) {
			console.warn("Failed to create default order delivery:", error);
			// Don't fail the order creation if delivery creation fails
		}
	}

	// Create a default order payment with the first available payment method
	if (paymentMethods.length > 0) {
		try {
			await db.insert(orderPayment).values({
				orderId: orderCreated.id,
				orderPaymentMethodId: paymentMethods[0].id,
				totalPriceInCents: 0, // Will be calculated later
			});
		} catch (error) {
			console.warn("Failed to create default order payment:", error);
			// Don't fail the order creation if payment creation fails
		}
	}

	return NextResponse.json({
		order: {
			id: orderCreated.id,
		},
	});
}
