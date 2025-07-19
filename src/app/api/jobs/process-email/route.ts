import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { z } from "zod";
import {
	createErrorResponse,
	createSuccessResponse,
	handleApiError,
} from "@/lib/api-response";
import {
	sendOrderConfirmationEmail,
	sendOrderUpdateEmail,
	sendPasswordResetEmail,
	sendWelcomeEmail,
} from "@/lib/resend";

const emailJobSchema = z.object({
	type: z.enum([
		"welcome",
		"password-reset",
		"order-confirmation",
		"order-update",
	]),
	userId: z.string().optional(),
	email: z.string().email(),
	data: z.record(z.any()),
	notificationId: z.string().optional(),
});

async function handler(request: Request) {
	try {
		const body = await request.json();
		const job = emailJobSchema.parse(body);

		console.log(`Processing email job: ${job.type} for ${job.email}`);

		// Generate unsubscribe URL if notificationId is provided
		const unsubscribeUrl = job.notificationId
			? `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${btoa(
					JSON.stringify({
						userId: job.userId,
						notificationId: job.notificationId,
						email: job.email,
					}),
				)}`
			: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe`;

		// Process the email job based on type
		let result: { success: boolean; messageId?: string; error?: string };

		switch (job.type) {
			case "welcome":
				result = await sendWelcomeEmail({
					name: job.data.name || "Usuário",
					email: job.email,
					unsubscribeUrl,
				});
				break;

			case "password-reset":
				result = await sendPasswordResetEmail(
					{
						resetUrl: job.data.resetUrl,
						unsubscribeUrl,
					},
					job.email,
				);
				break;

			case "order-confirmation":
				result = await sendOrderConfirmationEmail(
					{
						orderNumber: job.data.orderNumber,
						customerName: job.data.customerName,
						total: job.data.totalAmount,
						items: job.data.items,
						unsubscribeUrl,
					},
					job.email,
				);
				break;

			case "order-update":
				result = await sendOrderUpdateEmail(
					{
						orderNumber: job.data.orderNumber,
						customerName: job.data.customerName,
						status: job.data.status,
						message: job.data.message,
						trackingUrl: job.data.trackingUrl,
						unsubscribeUrl,
					},
					job.email,
				);
				break;

			default:
				throw new Error(`Unknown email job type: ${job.type}`);
		}

		if (result.success) {
			console.log(`✅ Email sent successfully: ${job.type} to ${job.email}`);
			return createSuccessResponse({
				messageId: result.messageId,
				type: job.type,
				email: job.email,
			}).json();
		} else {
			console.error(
				`❌ Failed to send email: ${job.type} to ${job.email}`,
				result.error,
			);
			return createErrorResponse(
				"Failed to send email",
				500,
				undefined,
				result.error,
			).json();
		}
	} catch (error) {
		console.error("Email job processing error:", error);
		return handleApiError(error).json();
	}
}

// Export with QStash signature verification
export const POST = verifySignatureAppRouter(handler);
