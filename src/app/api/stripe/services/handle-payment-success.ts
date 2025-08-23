import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { order, orderPayment } from "@/lib/db/schema";

/**
 * Handles successful payment by updating order and payment status
 */
export async function handlePaymentSuccess(
	paymentIntent: Stripe.PaymentIntent,
) {
	console.debug(`🔔  Processing payment success: ${paymentIntent.id}`);
	console.debug("💰 Payment captured!");

	try {
		// Find the order payment by Stripe PaymentIntent ID
		const orderPaymentFound = await db.query.orderPayment.findFirst({
			where: eq(orderPayment.stripePaymentIntentId, paymentIntent.id),
			with: {
				order: true,
			},
		});

		if (!orderPaymentFound) {
			console.debug(`⚠️  No order found for PaymentIntent ${paymentIntent.id}`);
			return { success: false, reason: "Order not found" };
		}

		// Update payment status to paid
		await db
			.update(orderPayment)
			.set({
				orderPaymentStatus: "paid",
				stripePaymentMethodId: paymentIntent.payment_method as string,
			})
			.where(eq(orderPayment.id, orderPaymentFound.id));

		// Update order status to paid
		await db
			.update(order)
			.set({
				orderStatus: "paid",
			})
			.where(eq(order.id, orderPaymentFound.orderId));

		console.debug(`✅ Order ${orderPaymentFound.orderId} marked as paid`);
		return {
			success: true,
			orderId: orderPaymentFound.orderId,
			orderPaymentId: orderPaymentFound.id,
		};
	} catch (error) {
		console.error("❌ Error updating order status:", error);
		throw error;
	}
}
