import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { orderPayment } from "@/lib/db/schema";

/**
 * Handles failed payment by updating payment status
 */
export async function handlePaymentFailure(
	paymentIntent: Stripe.PaymentIntent,
) {
	console.debug(`🔔  Processing payment failure: ${paymentIntent.id}`);
	console.debug("❌ Payment failed.");

	try {
		// Find the order payment by Stripe PaymentIntent ID
		const orderPaymentFound = await db.query.orderPayment.findFirst({
			where: eq(orderPayment.stripePaymentIntentId, paymentIntent.id),
		});

		if (!orderPaymentFound) {
			console.debug(`⚠️  No order found for PaymentIntent ${paymentIntent.id}`);
			return { success: false, reason: "Order not found" };
		}

		// Update payment status to failed
		await db
			.update(orderPayment)
			.set({
				orderPaymentStatus: "failed",
			})
			.where(eq(orderPayment.id, orderPaymentFound.id));

		console.debug(`❌ Order payment ${orderPaymentFound.id} marked as failed`);
		return {
			success: true,
			orderPaymentId: orderPaymentFound.id,
		};
	} catch (error) {
		console.error("❌ Error updating payment status:", error);
		throw error;
	}
}
