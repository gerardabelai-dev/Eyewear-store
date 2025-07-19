import { render } from "@react-email/components";
import { Resend } from "resend";
import OrderConfirmationEmail from "@/components/emails/order-confirmation-email";
import OrderUpdateEmail from "@/components/emails/order-update-email";
import PasswordResetEmail from "@/components/emails/password-reset-email";

// Import React Email templates
import WelcomeEmail from "@/components/emails/welcome-email";
import { BRAND_CONFIG } from "@/components/shared/brand";
import { serverEnv } from "./env";
import type {
	NotificationChannel,
	NotificationMetadata,
	NotificationProvider,
	NotificationType,
	OrderConfirmationEmailData,
	OrderUpdateEmailData,
	PasswordResetEmailData,
	WelcomeEmailData,
} from "./notifications/types";

// Initialize Resend client
export const resend = new Resend(serverEnv.RESEND_API_KEY);

// Email sending configuration
interface SendEmailOptions {
	to: string | string[];
	subject: string;
	notificationType: NotificationType;
	metadata?: NotificationMetadata;
	userId?: string;
	unsubscribeUrl?: string;
}

// Generate unsubscribe URL
export function generateUnsubscribeUrl(
	userId: string,
	notificationId?: string,
): string {
	const baseUrl = serverEnv.NEXT_PUBLIC_APP_URL;
	const token = Buffer.from(
		JSON.stringify({
			userId,
			notificationId: notificationId || "",
			email: "",
			iat: Date.now(),
		}),
	).toString("base64url");

	return `${baseUrl}/unsubscribe?token=${token}`;
}

// Create headers to prevent Gmail threading and add unsubscribe functionality
function createEmailHeaders(options: SendEmailOptions): Record<string, string> {
	const headers: Record<string, string> = {
		// Prevent Gmail threading by adding unique identifiers
		"Message-ID": `<${Date.now()}-${Math.random().toString(36)}@${BRAND_CONFIG.email.split("@")[1]}>`,
		Date: new Date().toUTCString(),
		// Custom headers for tracking
		"X-Notification-Type": options.notificationType,
		"X-Brand": BRAND_CONFIG.name,
	};

	// Add unsubscribe headers if URL is provided
	if (options.unsubscribeUrl) {
		headers["List-Unsubscribe"] = `<${options.unsubscribeUrl}>`;
		headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
	}

	// Add priority for transactional emails
	if (options.notificationType === "transactional") {
		headers["X-Priority"] = "1";
		headers.Importance = "high";
	}

	return headers;
}

// Base email sending function
async function sendEmailWithTemplate(
	react: React.ReactElement,
	options: SendEmailOptions,
) {
	try {
		const html = await render(react);
		const text = await render(react, { plainText: true });

		const headers = createEmailHeaders(options);

		const result = await resend.emails.send({
			from: `${BRAND_CONFIG.name} <noreply@${BRAND_CONFIG.email.split("@")[1]}>`,
			to: options.to,
			subject: options.subject,
			html,
			text,
			headers,
			tags: [
				{ name: "notification_type", value: options.notificationType },
				{ name: "brand", value: BRAND_CONFIG.name },
				...(options.metadata?.tags?.map((tag) => ({
					name: "custom",
					value: tag,
				})) || []),
			],
		});

		return {
			success: true,
			data: result,
			messageId: result.data?.id,
		};
	} catch (error) {
		console.error("Failed to send email:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

// Welcome email
export async function sendWelcomeEmail(data: WelcomeEmailData) {
	const react = WelcomeEmail(data);

	return sendEmailWithTemplate(react, {
		to: data.email,
		subject: `Bem-vindo ao ${BRAND_CONFIG.name}!`,
		notificationType: "marketing",
		unsubscribeUrl: data.unsubscribeUrl,
		metadata: {
			templateId: "welcome",
			priority: "normal",
		},
	});
}

// Order confirmation email
export async function sendOrderConfirmationEmail(
	data: OrderConfirmationEmailData,
	customerEmail: string,
) {
	const react = OrderConfirmationEmail(data);

	return sendEmailWithTemplate(react, {
		to: customerEmail,
		subject: `Pedido #${data.orderNumber} confirmado - ${BRAND_CONFIG.name}`,
		notificationType: "order_updates",
		unsubscribeUrl: data.unsubscribeUrl,
		metadata: {
			templateId: "order_confirmation",
			orderId: data.orderNumber,
			priority: "high",
		},
	});
}

// Password reset email
export async function sendPasswordResetEmail(
	data: PasswordResetEmailData,
	userEmail: string,
) {
	const react = PasswordResetEmail(data);

	return sendEmailWithTemplate(react, {
		to: userEmail,
		subject: `Redefinir senha - ${BRAND_CONFIG.name}`,
		notificationType: "transactional",
		unsubscribeUrl: data.unsubscribeUrl,
		metadata: {
			templateId: "password_reset",
			priority: "urgent",
		},
	});
}

// Order update email
export async function sendOrderUpdateEmail(
	data: OrderUpdateEmailData,
	userEmail: string,
) {
	const react = OrderUpdateEmail(data);

	const statusTitles = {
		processing: "Processando",
		shipped: "Enviado",
		delivered: "Entregue",
		cancelled: "Cancelado",
		returned: "Devolvido",
	};

	const statusTitle =
		statusTitles[data.status as keyof typeof statusTitles] || "Atualizado";

	return sendEmailWithTemplate(react, {
		to: userEmail,
		subject: `Pedido #${data.orderNumber} ${statusTitle} - ${BRAND_CONFIG.name}`,
		notificationType: "order_updates",
		unsubscribeUrl: data.unsubscribeUrl,
		metadata: {
			templateId: "order_update",
			orderId: data.orderNumber,
			status: data.status,
			priority: "normal",
		},
	});
}

// Newsletter email
export async function sendNewsletterEmail(
	to: string,
	subject: string,
	content: string,
	unsubscribeUrl: string,
	metadata?: NotificationMetadata,
) {
	// For newsletter, we'll use a simple HTML template since we don't have a React component yet
	const html = `
		<!DOCTYPE html>
		<html lang="pt-BR">
			<head>
				<title>${subject}</title>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto;">
				<div style="background: #ffffff; padding: 40px 20px;">
					<div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;">
						<div style="display: inline-block; padding: 8px; background: linear-gradient(135deg, ${BRAND_CONFIG.colors.primary} 0%, ${BRAND_CONFIG.colors.primaryDark} 100%); border-radius: 8px; margin-bottom: 10px;">
							<span style="color: white; font-weight: bold; font-size: 14px;">Dr</span>
						</div>
						<h1 style="color: ${BRAND_CONFIG.colors.text}; margin: 0; font-size: 24px;">${BRAND_CONFIG.name}</h1>
					</div>
					
					<div style="padding: 20px 0;">
						${content}
					</div>
					
					<div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280;">
						<p>Você está recebendo este email porque se inscreveu em nossa newsletter.</p>
						<p>
							<a href="${unsubscribeUrl}" style="color: ${BRAND_CONFIG.colors.primary};">Cancelar inscrição</a> | 
							<a href="${BRAND_CONFIG.website}/privacidade" style="color: ${BRAND_CONFIG.colors.primary};">Política de Privacidade</a>
						</p>
						<p>© ${new Date().getFullYear()} ${BRAND_CONFIG.name}. Todos os direitos reservados.<br>
						${BRAND_CONFIG.address}</p>
					</div>
				</div>
			</body>
		</html>
	`;

	return sendEmailWithTemplate(html as any, {
		to,
		subject,
		notificationType: "newsletters",
		unsubscribeUrl,
		metadata: {
			templateId: "newsletter",
			...metadata,
		},
	});
}

// Promotion email
export async function sendPromotionEmail(
	to: string,
	subject: string,
	title: string,
	description: string,
	ctaUrl: string,
	ctaText: string,
	unsubscribeUrl: string,
	options?: {
		discountCode?: string;
		discountAmount?: string;
		expiresAt?: Date;
	},
) {
	const html = `
		<!DOCTYPE html>
		<html lang="pt-BR">
			<head>
				<title>${subject}</title>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto;">
				<div style="background: #ffffff; padding: 40px 20px;">
					<div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;">
						<div style="display: inline-block; padding: 8px; background: linear-gradient(135deg, ${BRAND_CONFIG.colors.primary} 0%, ${BRAND_CONFIG.colors.primaryDark} 100%); border-radius: 8px; margin-bottom: 10px;">
							<span style="color: white; font-weight: bold; font-size: 14px;">Dr</span>
						</div>
						<h1 style="color: ${BRAND_CONFIG.colors.text}; margin: 0; font-size: 24px;">${BRAND_CONFIG.name}</h1>
					</div>
					
					<div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, ${BRAND_CONFIG.colors.accent}22 0%, ${BRAND_CONFIG.colors.primary}22 100%); border-radius: 12px; margin-bottom: 30px;">
						<h2 style="color: ${BRAND_CONFIG.colors.text}; margin: 0 0 15px 0; font-size: 28px;">🎉 ${title}</h2>
						<p style="color: ${BRAND_CONFIG.colors.gray}; margin: 0 0 20px 0; font-size: 16px;">${description}</p>
						
						${
							options?.discountCode
								? `
							<div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px dashed ${BRAND_CONFIG.colors.accent};">
								<p style="margin: 0; font-size: 14px; color: ${BRAND_CONFIG.colors.gray};">Código de desconto:</p>
								<p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: ${BRAND_CONFIG.colors.primary}; letter-spacing: 2px;">${options.discountCode}</p>
								${options.discountAmount ? `<p style="margin: 5px 0 0 0; font-size: 16px; color: ${BRAND_CONFIG.colors.secondary};">${options.discountAmount} de desconto</p>` : ""}
							</div>
						`
								: ""
						}
						
						<a href="${ctaUrl}" style="display: inline-block; background: ${BRAND_CONFIG.colors.accent}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 10px;">
							${ctaText}
						</a>
						
						${
							options?.expiresAt
								? `
							<p style="margin: 15px 0 0 0; font-size: 12px; color: ${BRAND_CONFIG.colors.gray};">
								⏰ Válido até ${options.expiresAt.toLocaleDateString("pt-BR")}
							</p>
						`
								: ""
						}
					</div>
					
					<div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280;">
						<p>Você está recebendo este email porque se inscreveu em nossas promoções.</p>
						<p>
							<a href="${unsubscribeUrl}" style="color: ${BRAND_CONFIG.colors.primary};">Cancelar inscrição</a> | 
							<a href="${BRAND_CONFIG.website}/privacidade" style="color: ${BRAND_CONFIG.colors.primary};">Política de Privacidade</a>
						</p>
						<p>© ${new Date().getFullYear()} ${BRAND_CONFIG.name}. Todos os direitos reservados.<br>
						${BRAND_CONFIG.address}</p>
					</div>
				</div>
			</body>
		</html>
	`;

	return sendEmailWithTemplate(html as any, {
		to,
		subject,
		notificationType: "promotions",
		unsubscribeUrl,
		metadata: {
			templateId: "promotion",
			campaignId: options?.discountCode,
		},
	});
}

// Generic email sending function for custom templates
export async function sendCustomEmail(
	to: string | string[],
	subject: string,
	html: string,
	notificationType: NotificationType = "system_notifications",
	unsubscribeUrl?: string,
	metadata?: NotificationMetadata,
) {
	return sendEmailWithTemplate(html as any, {
		to,
		subject,
		notificationType,
		unsubscribeUrl,
		metadata,
	});
}

// Export email configuration
export const emailConfig = {
	from: `${BRAND_CONFIG.name} <noreply@${BRAND_CONFIG.email.split("@")[1]}>`,
	domain: BRAND_CONFIG.email.split("@")[1],
	supportEmail: BRAND_CONFIG.email,
} as const;
