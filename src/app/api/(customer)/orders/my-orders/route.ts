import "server-only";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { customer, order } from "@/lib/db/schema";

export async function GET() {
	// Check if user is authenticated
	const user = await getCurrentUser();

	if (!user) {
		return Response.json(mapErrorCodes(ERROR_CODES.UNAUTHORIZED), {
			status: HTTP_CODES.UNAUTHORIZED,
		});
	}

	// Get customer by userId
	const customerFound = await db.query.customer.findFirst({
		where: eq(customer.userId, user.id),
	});

	if (!customerFound) {
		return Response.json(mapErrorCodes(ERROR_CODES.CUSTOMER_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	// Get all orders for this customer
	const orders = await db.query.order.findMany({
		where: eq(order.customerId, customerFound.id),
		orderBy: [desc(order.createdAt)],
		with: {
			cart: {
				with: {
					cartProducts: {
						with: {
							product: {
								with: {
									images: true,
									productPrice: true,
								},
							},
							productPrice: true,
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

	return NextResponse.json({
		orders,
	});
}
