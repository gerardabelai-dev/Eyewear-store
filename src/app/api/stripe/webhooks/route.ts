import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { env } from "@/lib/env";
import { handlePaymentFailure } from "../services/handle-payment-failure";
import { handlePaymentSuccess } from "../services/handle-payment-success";
import { stripe } from "../stripe-client";

export async function POST(request: NextRequest) {
	const body = await request.text();
	const signature = request.headers.get("stripe-signature");

	if (!signature) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.MISSING_STRIPE_SIGNATURE),
			{
				status: HTTP_CODES.BAD_REQUEST,
			},
		);
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.INVALID_STRIPE_SIGNATURE),
			{
				status: HTTP_CODES.BAD_REQUEST,
			},
		);
	}

	// Handle the event
	switch (event.type) {
		case "payment_intent.succeeded": {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;

			try {
				await handlePaymentSuccess(paymentIntent);
			} catch (error) {
				console.error("❌ Error processing payment success:", error);
				// Note: We still return 200 to Stripe to avoid retries for application errors
			}
			break;
		}

		case "payment_intent.payment_failed": {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;

			try {
				await handlePaymentFailure(paymentIntent);
			} catch (error) {
				console.error("❌ Error processing payment failure:", error);
				// Note: We still return 200 to Stripe to avoid retries for application errors
			}
			break;
		}

		default:
			console.debug(`🤷‍♀️ Unhandled event type: ${event.type}`);
	}

	return NextResponse.json({ received: true });
}
