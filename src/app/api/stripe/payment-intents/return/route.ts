import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Return URL for redirect-based payment methods
 * For card payments, this won't be called, but Stripe requires it to be configured
 */
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const paymentIntentId = searchParams.get("payment_intent");
	const paymentIntentClientSecret = searchParams.get(
		"payment_intent_client_secret",
	);

	console.log("📥 Payment intent return:", {
		paymentIntentId,
		paymentIntentClientSecret,
	});

	// Redirect to a generic success page or back to checkout
	// The webhook will handle updating the payment status
	return NextResponse.redirect(new URL("/", request.nextUrl.origin));
}
