import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { order, orderPayment } from "@/lib/db/schema";
import { resend } from "@/lib/resend/client";
import PaymentConfirmedEmail from "../../../../../emails/payment-confirmed";

/**
 * Handles successful payment by updating order and payment status
 */
export async function handlePaymentSuccess(
	paymentIntent: Stripe.PaymentIntent,
) {
	try {
		// Find the order payment by Stripe PaymentIntent ID
		const orderPaymentFound = await db.query.orderPayment.findFirst({
			where: eq(orderPayment.stripePaymentIntentId, paymentIntent.id),
			with: {
				order: {
					with: {
						customer: true,
						customerAddress: true,
						payment: {
							with: {
								orderPaymentMethod: true,
							},
						},
						cart: {
							with: {
								cartProducts: {
									with: {
										productPrice: true,
										product: {
											with: {
												images: true,
												productPrice: true,
											},
										},
									},
								},
							},
						},
						delivery: {
							with: {
								orderDeliveryMethod: true,
							},
						},
					},
				},
			},
		});

		if (!orderPaymentFound) {
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
		const { data, error } = await resend.emails.send({
			from: "Dr. Vista <onboarding@resend.dev>",
			to: ["delivered@resend.dev"],
			subject: "Seu pagamento foi realizado com sucesso!",
			react: PaymentConfirmedEmail({
				customerName: orderPaymentFound.order.customer?.firstName || "N/A",
				orderNumber: orderPaymentFound.order.id,
				orderDate: orderPaymentFound.order.createdAt.toISOString(),
				paymentMethod:
					orderPaymentFound.order.payment?.orderPaymentMethod.method || "N/A",
				products:
					orderPaymentFound.order.cart?.cartProducts
						.filter((item) => !item.parentProductId) // Only parent products
						.map((item) => {
							const subItems =
								orderPaymentFound.order.cart?.cartProducts.filter(
									(sub) => sub.parentProductId === item.productId,
								) || [];

							// Calculate unit price (base product + all sub-items per unit)
							const basePrice = item.productPrice?.priceInCents || 0;
							const subItemsTotal = subItems.reduce(
								(acc, sub) => acc + (sub.productPrice?.priceInCents || 0),
								0,
							);
							const unitPrice = basePrice + subItemsTotal;

							return {
								name: item.product.name,
								image: item.product.images?.[0]?.imageUrl || "",
								price: unitPrice,
								quantity: item.quantity,
								prescription: "OD: -2.00 | OE: -1.75", // TODO: make this reflect actual prescription
								subItems: subItems.map((sub) => ({
									name: sub.product.name,
									price: sub.productPrice?.priceInCents || 0,
									quantity: sub.quantity,
								})),
							};
						}) || [],
				subtotal:
					orderPaymentFound.order?.cart?.cartProducts.reduce(
						(acc, item) =>
							acc + (item.productPrice?.priceInCents || 0) * item.quantity,
						0,
					) || 0,
				shipping:
					orderPaymentFound.order.delivery?.orderDeliveryMethod.costInCents ||
					0,
				total: orderPaymentFound.order.payment?.totalPriceInCents || 0,
				shippingAddress: {
					street: orderPaymentFound.order.customerAddress?.street || "N/A",
					city: orderPaymentFound.order.customerAddress?.city || "N/A",
					state: orderPaymentFound.order.customerAddress?.state || "N/A",
					zipCode: orderPaymentFound.order.customerAddress?.zipCode || "N/A",
				},
				estimatedDelivery: "7 a 10 dias úteis",
			}),
		});

		if (error) {
			console.error("Error sending payment confirmation email:", error);
		}

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
