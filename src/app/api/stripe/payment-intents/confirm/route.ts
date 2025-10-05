import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { handlePaymentSuccess } from "../../services/handle-payment-success";
import { stripe } from "../../stripe-client";

const confirmPaymentIntentSchema = z.object({
	paymentIntentId: z.string(),
	paymentMethodId: z.string(),
});

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { success, error, data } = confirmPaymentIntentSchema.safeParse(body);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { paymentIntentId, paymentMethodId } = data;

	try {
		const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
			payment_method: paymentMethodId,
			return_url: `${request.nextUrl.origin}/api/stripe/payment-intents/return`,
		});

		// If payment succeeded, handle it immediately
		if (paymentIntent.status === "succeeded") {
			try {
				await handlePaymentSuccess(paymentIntent);
			} catch (error) {
				console.error("Error in payment success handler:", error);
				// Don't fail the response
			}
		}

		return NextResponse.json({
			paymentIntent: {
				id: paymentIntent.id,
				status: paymentIntent.status,
				client_secret: paymentIntent.client_secret,
			},
		});
	} catch (error) {
		console.error("❌ Error confirming payment intent:", error);

		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_CONFIRM_PAYMENT_INTENT),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}
}
