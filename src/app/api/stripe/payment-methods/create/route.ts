import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/app/api/stripe/stripe-client";

const createPaymentMethodSchema = z.object({
	cardNumber: z.string().min(13).max(19),
	expiryMonth: z.number().min(1).max(12),
	expiryYear: z.number().min(new Date().getFullYear()),
	cvc: z.string().min(3).max(4),
	cardholderName: z.string().min(2),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = createPaymentMethodSchema.parse(body);

		// Map test card numbers to Stripe test tokens
		const cardNumber = validatedData.cardNumber.replace(/\s/g, "");
		let testToken: string | null = null;

		// Use Stripe test tokens for common test card numbers
		switch (cardNumber) {
			case "4242424242424242": // Visa
				testToken = "tok_visa";
				break;
			case "4000056655665556": // Visa (debit)
				testToken = "tok_visa_debit";
				break;
			case "5555555555554444": // Mastercard
				testToken = "tok_mastercard";
				break;
			case "2223003122003222": // Mastercard (2-series)
				testToken = "tok_mastercard";
				break;
			case "378282246310005": // American Express
				testToken = "tok_amex";
				break;
			case "6011111111111117": // Discover
				testToken = "tok_discover";
				break;
			default:
				// For other cards, try to create with raw data (might fail in some environments)
				break;
		}

		let paymentMethod;

		if (testToken) {
			// Create payment method using test token
			paymentMethod = await stripe.paymentMethods.create({
				type: "card",
				card: {
					token: testToken,
				},
				billing_details: {
					name: validatedData.cardholderName,
				},
			});
		} else {
			// Try to create with raw card data (for production or enabled test environments)
			try {
				paymentMethod = await stripe.paymentMethods.create({
					type: "card",
					card: {
						number: cardNumber,
						exp_month: validatedData.expiryMonth,
						exp_year: validatedData.expiryYear,
						cvc: validatedData.cvc,
					},
					billing_details: {
						name: validatedData.cardholderName,
					},
				});
			} catch (stripeError: any) {
				if (
					stripeError.type === "StripeInvalidRequestError" &&
					stripeError.message?.includes("credit card numbers directly")
				) {
					return NextResponse.json(
						{
							error:
								"Por favor, use um cartão de teste válido. Números sugeridos: 4242 4242 4242 4242 (Visa), 5555 5555 5555 4444 (Mastercard)",
						},
						{ status: 400 },
					);
				}
				throw stripeError;
			}
		}

		return NextResponse.json({
			paymentMethodId: paymentMethod.id,
		});
	} catch (error) {
		console.error("Error creating payment method:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid card data", details: error.issues },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to create payment method" },
			{ status: 500 },
		);
	}
}
