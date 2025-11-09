import "server-only";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { db } from "@/lib/db";
import { coupon } from "@/lib/db/schema";

const validateCouponSchema = z.object({
	code: z.string().min(1, "Código do cupom é obrigatório"),
	subtotalInCents: z.number().min(0, "Subtotal deve ser maior que 0"),
});

export async function POST(request: Request) {
	const body = await request.json();
	const validation = validateCouponSchema.safeParse(body);

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

	const { code, subtotalInCents } = validation.data;

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

	return NextResponse.json({
		coupon: {
			id: couponFound.id,
			code: couponFound.code,
			type: couponFound.type,
			discountPercentage: couponFound.discountPercentage,
			discountAmountInCents: couponFound.discountAmountInCents,
			discountInCents,
		},
	});
}
