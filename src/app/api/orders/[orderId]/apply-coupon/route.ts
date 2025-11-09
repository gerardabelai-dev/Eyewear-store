import "server-only";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { db } from "@/lib/db";
import { coupon, order, orderPayment } from "@/lib/db/schema";

const applyCouponSchema = z.object({
	code: z.string().min(1, "Código do cupom é obrigatório"),
});

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ orderId: string }> },
) {
	const { orderId } = await params;

	const body = await request.json();
	const validation = applyCouponSchema.safeParse(body);

	if (!validation.success) {
		return Response.json(
			{
				error: ERROR_CODES.INVALID_COUPON_CODE,
				message: validation.error.issues[0]?.message,
			},
			{
				status: HTTP_CODES.BAD_REQUEST,
			},
		);
	}

	const { code } = validation.data;

	// Find order with payment and cart
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

	// Check if order already has a coupon
	if (orderFound.payment.couponId) {
		return Response.json(mapErrorCodes(ERROR_CODES.ORDER_ALREADY_HAS_COUPON), {
			status: HTTP_CODES.BAD_REQUEST,
		});
	}

	// Find coupon by code (case-insensitive)
	const couponFound = await db.query.coupon.findFirst({
		where: eq(coupon.code, code.toUpperCase()),
	});

	if (!couponFound) {
		return Response.json(mapErrorCodes(ERROR_CODES.COUPON_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	// Check if coupon is active
	if (couponFound.status !== "active") {
		return Response.json(mapErrorCodes(ERROR_CODES.COUPON_INACTIVE), {
			status: HTTP_CODES.BAD_REQUEST,
		});
	}

	// Check if coupon is expired
	const now = new Date();
	const validFrom = new Date(couponFound.validFrom);
	const validUntil = couponFound.validUntil
		? new Date(couponFound.validUntil)
		: null;

	if (now < validFrom || (validUntil && now > validUntil)) {
		return Response.json(mapErrorCodes(ERROR_CODES.COUPON_EXPIRED), {
			status: HTTP_CODES.BAD_REQUEST,
		});
	}

	// Check usage limit
	if (
		couponFound.usageLimit !== null &&
		couponFound.usageCount >= couponFound.usageLimit
	) {
		return Response.json(
			mapErrorCodes(ERROR_CODES.COUPON_USAGE_LIMIT_REACHED),
			{
				status: HTTP_CODES.BAD_REQUEST,
			},
		);
	}

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

	// Check minimum order value
	if (
		couponFound.minOrderValueInCents &&
		subtotalInCents < couponFound.minOrderValueInCents
	) {
		return Response.json(
			mapErrorCodes(ERROR_CODES.MINIMUM_ORDER_VALUE_NOT_MET),
			{
				status: HTTP_CODES.BAD_REQUEST,
			},
		);
	}

	// Calculate discount
	let discountInCents = 0;

	if (couponFound.type === "percentage") {
		if (couponFound.discountPercentage) {
			discountInCents = Math.round(
				(subtotalInCents * couponFound.discountPercentage) / 100,
			);

			// Apply max discount cap if exists
			if (
				couponFound.maxDiscountInCents &&
				discountInCents > couponFound.maxDiscountInCents
			) {
				discountInCents = couponFound.maxDiscountInCents;
			}
		}
	} else if (couponFound.type === "fixed_amount") {
		if (couponFound.discountAmountInCents) {
			discountInCents = Math.min(
				couponFound.discountAmountInCents,
				subtotalInCents,
			);
		}
	}

	// Calculate new total
	const newTotalInCents =
		subtotalInCents +
		orderFound.payment.shippingCostInCents +
		orderFound.payment.taxInCents -
		discountInCents;

	try {
		// Update order payment with coupon
		await db
			.update(orderPayment)
			.set({
				couponId: couponFound.id,
				couponCode: couponFound.code,
				discountInCents,
				subtotalInCents,
				totalPriceInCents: newTotalInCents,
				updatedAt: new Date(),
			})
			.where(eq(orderPayment.id, orderFound.payment.id));

		// Increment coupon usage count
		await db
			.update(coupon)
			.set({
				usageCount: sql`${coupon.usageCount} + 1`,
				updatedAt: new Date(),
			})
			.where(eq(coupon.id, couponFound.id));

		return NextResponse.json({
			success: true,
			coupon: {
				id: couponFound.id,
				code: couponFound.code,
				discountInCents,
			},
			payment: {
				subtotalInCents,
				discountInCents,
				totalPriceInCents: newTotalInCents,
			},
		});
	} catch (error) {
		console.error("Failed to apply coupon:", error);
		return Response.json(mapErrorCodes(ERROR_CODES.FAILED_TO_APPLY_COUPON), {
			status: HTTP_CODES.INTERNAL_SERVER_ERROR,
		});
	}
}
