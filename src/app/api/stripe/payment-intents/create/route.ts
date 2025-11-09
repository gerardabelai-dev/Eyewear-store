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

	// Calculate order total with product-level discounts applied
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

	// Get delivery cost
	const defaultDeliveryCostInCents = 1000; // Default R$ 10,00
	const deliveryCostInCents =
		orderFound.delivery?.orderDeliveryMethod?.costInCents ||
		defaultDeliveryCostInCents;

	// Fixed taxes (as per your current approach)
	// TODO: Implement stripe taxes calculation
	const defaultTaxesInCents = 1000; // R$ 10,00
	const taxesInCents = defaultTaxesInCents;

	// Get coupon discount if applied
	const discountInCents = orderFound.payment?.discountInCents || 0;

	const totalInCents =
		subtotalInCents + deliveryCostInCents + taxesInCents - discountInCents;

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

		// Create or update the order payment with Stripe information
		let orderPaymentRecord: any;

		if (orderFound.payment) {
			// Update existing order payment
			const [updatedOrderPayment] = await db
				.update(orderPayment)
				.set({
					stripePaymentIntentId: paymentIntent.id,
					stripeClientSecret: paymentIntent.client_secret,
					subtotalInCents,
					shippingCostInCents: deliveryCostInCents,
					taxInCents: taxesInCents,
					discountInCents,
					totalPriceInCents: totalInCents,
					updatedAt: new Date(),
				})
				.where(eq(orderPayment.id, orderFound.payment.id))
				.returning();

			orderPaymentRecord = updatedOrderPayment;
		} else {
			// Find Credit Card payment method
			const creditCardMethod = await db.query.orderPaymentMethod.findFirst({
				where: (orderPaymentMethod, { eq }) =>
					eq(orderPaymentMethod.method, "Credit Card"),
			});

			if (!creditCardMethod) {
				return NextResponse.json(
					mapErrorCodes(ERROR_CODES.PAYMENT_METHOD_NOT_FOUND),
					{ status: HTTP_CODES.NOT_FOUND },
				);
			}

			// Create new order payment
			const [newOrderPayment] = await db
				.insert(orderPayment)
				.values({
					orderId: orderId,
					orderPaymentMethodId: creditCardMethod.id,
					stripePaymentIntentId: paymentIntent.id,
					stripeClientSecret: paymentIntent.client_secret,
					subtotalInCents,
					shippingCostInCents: deliveryCostInCents,
					taxInCents: taxesInCents,
					discountInCents,
					totalPriceInCents: totalInCents,
					orderPaymentStatus: "pending",
				})
				.returning();

			orderPaymentRecord = newOrderPayment;
		}

		if (!orderPaymentRecord) {
			return NextResponse.json(
				mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_ORDER_PAYMENT),
				{ status: HTTP_CODES.INTERNAL_SERVER_ERROR },
			);
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
