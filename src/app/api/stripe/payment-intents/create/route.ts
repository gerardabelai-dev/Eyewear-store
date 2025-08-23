import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { order, orderPayment } from "@/lib/db/schema";
import { stripe } from "../../stripe-client";

const createPaymentIntentSchema = z.object({
	orderId: z.string(),
});

export async function POST(request: Request) {
	const body = await request.json();

	const { success, error, data } = createPaymentIntentSchema.safeParse(body);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { orderId } = data;

	// Get the order with its cart products to calculate total
	const orderFound = await db.query.order.findFirst({
		where: eq(order.id, orderId),
		with: {
			cart: {
				with: {
					cartProducts: {
						with: {
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
			payment: true,
		},
	});

	if (!orderFound) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.ORDER_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	// Throw error if order already has a Stripe payment intent
	if (orderFound.payment?.stripePaymentIntentId) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.ORDER_ALREADY_HAS_STRIPE_PAYMENT_INTENT),
			{
				status: HTTP_CODES.BAD_REQUEST,
			},
		);
	}

	// Calculate order total
	const cartProducts = orderFound.cart?.cartProducts || [];
	const subtotalInCents = cartProducts.reduce((total, item) => {
		const priceInCents = item.productPrice?.priceInCents || 0;
		return total + priceInCents * item.quantity;
	}, 0);

	// Get delivery cost
	const defaultDeliveryCostInCents = 1000; // Default R$ 10,00
	const deliveryCostInCents =
		orderFound.delivery?.orderDeliveryMethod?.costInCents ||
		defaultDeliveryCostInCents;

	// Fixed taxes (as per your current approach)
	// TODO: Implement stripe taxes calculation
	const defaultTaxesInCents = 1000; // R$ 10,00
	const taxesInCents = defaultTaxesInCents;

	const totalInCents = subtotalInCents + deliveryCostInCents + taxesInCents;

	try {
		// Create Stripe PaymentIntent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: totalInCents,
			currency: "brl", // Brazilian Real
			automatic_payment_methods: {
				enabled: true,
			},
			metadata: {
				orderId: orderId,
			},
		});

		// Update the order payment with Stripe information
		// TODO: consider creating order payment here instead of updating it
		if (orderFound.payment) {
			const updatedOrderPayment = await db
				.update(orderPayment)
				.set({
					stripePaymentIntentId: paymentIntent.id,
					stripeClientSecret: paymentIntent.client_secret,
					totalPriceInCents: totalInCents,
				})
				.where(eq(orderPayment.id, orderFound.payment.id));

			if (!updatedOrderPayment) {
				return NextResponse.json(
					mapErrorCodes(ERROR_CODES.FAILED_TO_UPDATE_ORDER_PAYMENT),
					{ status: HTTP_CODES.INTERNAL_SERVER_ERROR },
				);
			}
		}

		return NextResponse.json({
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
		});
	} catch (stripeError) {
		console.error(stripeError);
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.UNEXPECTED_STRIPE_ERROR),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}
}
