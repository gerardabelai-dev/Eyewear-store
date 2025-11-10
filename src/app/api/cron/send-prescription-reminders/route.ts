import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";
import { resend } from "@/lib/resend/client";
import PrescriptionReminderEmail from "../../../../../emails/prescription-reminder";

const HOURS_48_IN_MS = 48 * 60 * 60 * 1000;

export async function GET(request: Request) {
	try {
		// Verify this is a legitimate cron request
		const authHeader = request.headers.get("authorization");
		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		console.log("🕐 Cron job started: Checking for prescription reminders...");

		// Find orders that:
		// 1. Have status "awaiting_prescription"
		// 2. Were created more than 48 hours ago
		// 3. Haven't received a reminder yet
		const now = new Date();
		const cutoffDate = new Date(now.getTime() - HOURS_48_IN_MS);

		const ordersNeedingReminders = await db.query.order.findMany({
			where: (order, { and, eq, isNull, lt }) =>
				and(
					eq(order.orderStatus, "awaiting_prescription"),
					lt(order.createdAt, cutoffDate),
					isNull(order.prescriptionReminderSentAt),
				),
			with: {
				customer: {
					with: {
						user: true,
					},
				},
				cart: {
					with: {
						cartProducts: {
							with: {
								product: {
									with: {
										images: true,
									},
								},
							},
						},
					},
				},
			},
		});

		console.log(
			`📋 Found ${ordersNeedingReminders.length} orders needing prescription reminders`,
		);

		let sentCount = 0;
		let errorCount = 0;

		// Send reminder email for each order
		for (const orderRecord of ordersNeedingReminders) {
			try {
				if (
					!orderRecord.customer?.user?.email ||
					!orderRecord.customer?.firstName
				) {
					console.log(
						`⚠️  Skipping order ${orderRecord.id}: Missing customer email or name`,
					);
					continue;
				}

				// Get products requiring prescription
				const productsRequiringPrescription =
					orderRecord.cart?.cartProducts.filter(
						(cp) =>
							cp.product.requiresPrescription &&
							!cp.parentProductId &&
							cp.prescriptionStatus !== "uploaded",
					) || [];

				if (productsRequiringPrescription.length === 0) {
					console.log(
						`⚠️  Skipping order ${orderRecord.id}: No products requiring prescription`,
					);
					continue;
				}

				const baseUrl = process.env.WEB_URL || "https://drvista.com.br";
				const uploadUrl = `${baseUrl}/checkout/${orderRecord.id}/success`;

				// Prepare products for email
				const emailProducts = productsRequiringPrescription.map((cp) => {
					const imageUrl = cp.product.images?.[0]?.imageUrl || "";
					const proxyImageUrl = imageUrl
						? `${baseUrl}/api/images/proxy?url=${encodeURIComponent(imageUrl)}&w=200&q=60`
						: "";

					return {
						name: cp.product.name,
						image: proxyImageUrl,
					};
				});

				// Send email
				const { error } = await resend.emails.send({
					from: "Dr. Vista <contato@drvista.com.br>",
					to: [orderRecord.customer.user.email],
					subject: `Lembrete: Envie sua receita - Pedido #${orderRecord.id}`,
					react: PrescriptionReminderEmail({
						customerName: orderRecord.customer.firstName,
						orderNumber: orderRecord.id,
						products: emailProducts,
						uploadUrl,
					}),
				});

				if (error) {
					console.error(
						`❌ Error sending reminder for order ${orderRecord.id}:`,
						error,
					);
					errorCount++;
					continue;
				}

				// Mark reminder as sent
				await db
					.update(order)
					.set({
						prescriptionReminderSentAt: now,
					})
					.where(eq(order.id, orderRecord.id));

				console.log(`✅ Reminder sent for order ${orderRecord.id}`);
				sentCount++;
			} catch (error) {
				console.error(`❌ Error processing order ${orderRecord.id}:`, error);
				errorCount++;
			}
		}

		console.log(
			`✅ Cron job completed: Sent ${sentCount} reminders, ${errorCount} errors`,
		);

		return NextResponse.json({
			success: true,
			totalOrders: ordersNeedingReminders.length,
			sentCount,
			errorCount,
			timestamp: now.toISOString(),
		});
	} catch (error) {
		console.error("❌ Cron job failed:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
