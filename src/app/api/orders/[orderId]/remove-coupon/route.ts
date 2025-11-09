import "server-only";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { db } from "@/lib/db";
import { coupon, order, orderPayment } from "@/lib/db/schema";

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ orderId: string }> },
) {
	const { orderId } = await params;

	// Find order with payment
	const orderFound = await db.query.order.findFirst({
		where: eq(order.id, orderId),
		with: {
			payment: true,
			cart: {
				with: {
					cartProducts: {
						with: {
							product: true,
							productPrice: true,
						},
					},
				},
			},
		},
	});

	if (!orderFound) {
		return Response.json(mapErrorCodes(ERROR_CODES.ORDER_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	if (!orderFound.payment) {
		return Response.json(mapErrorCodes(ERROR_CODES.ORDER_PAYMENT_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	// Check if order has a coupon
	if (!orderFound.payment.couponId) {
		return Response.json(
			{
				error: "NO_COUPON_APPLIED",
				message: "Este pedido não possui cupom aplicado",
			},
			{
				status: HTTP_CODES.BAD_REQUEST,
			},
		);
	}

	const couponId = orderFound.payment.couponId;

	// Calculate subtotal with product-level discounts applied
	const cartProducts = orderFound.cart?.cartProducts || [];
	const subtotalInCents = cartProducts.reduce((total, item) => {
		const productPrice = item.productPrice;
		if (!productPrice) return total;

		// Apply product-level discount
		const discountMultiplier = 1 - productPrice.discountPercentage / 100;
		const discountedPrice = Math.round(
			productPrice.priceInCents * discountMultiplier,
		);
		return total + discountedPrice * item.quantity;
	}, 0);

	// Calculate new total without coupon discount
	const newTotalInCents =
		subtotalInCents +
		orderFound.payment.shippingCostInCents +
		orderFound.payment.taxInCents;

	try {
		// Update order payment to remove coupon
		await db
			.update(orderPayment)
			.set({
				couponId: null,
				couponCode: null,
				discountInCents: 0,
				subtotalInCents,
				totalPriceInCents: newTotalInCents,
				updatedAt: new Date(),
			})
			.where(eq(orderPayment.id, orderFound.payment.id));

		// Decrement coupon usage count
		await db
			.update(coupon)
			.set({
				usageCount: sql`GREATEST(0, ${coupon.usageCount} - 1)`,
				updatedAt: new Date(),
			})
			.where(eq(coupon.id, couponId));

		return NextResponse.json({
			success: true,
			payment: {
				subtotalInCents,
				discountInCents: 0,
				totalPriceInCents: newTotalInCents,
			},
		});
	} catch (error) {
		console.error("Failed to remove coupon:", error);
		return Response.json(mapErrorCodes(ERROR_CODES.FAILED_TO_REMOVE_COUPON), {
			status: HTTP_CODES.INTERNAL_SERVER_ERROR,
		});
	}
}
