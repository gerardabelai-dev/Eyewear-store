import "server-only";
import { Resend } from "resend";
import OrderConfirmationEmail from "@/components/emails/order-confirmation-email";
import OrderUpdateEmail from "@/components/emails/order-update-email";
import PasswordResetEmail from "@/components/emails/password-reset-email";
import WelcomeEmail from "@/components/emails/welcome-email";
import { BRAND_CONFIG } from "@/components/shared/brand";
import { serverEnv } from "./env";
import type {
	NotificationChannel,
	OrderConfirmationEmailData,
	OrderUpdateEmailData,
	PasswordResetEmailData,
	WelcomeEmailData,
} from "./notifications/types";

// Initialize Resend client
export const resend = new Resend(serverEnv.RESEND_API_KEY);

/**
 * Get the base URL for the application
 * Used in email templates for links and images
 */
export function getEmailBaseUrl(): string {
	// In production, this should be your actual domain
	// In development, this will be localhost
	const baseUrl = serverEnv.NEXT_PUBLIC_APP_URL;
	return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

/**
 * Generate unsubscribe URL with encoded token
 */
export function generateUnsubscribeUrl(
	userId: string,
	notificationId: string,
): string {
	const baseUrl = getEmailBaseUrl();
	const token = btoa(
		JSON.stringify({
			userId,
			notificationId,
		}),
	);
	return `${baseUrl}/unsubscribe?token=${token}`;
}

// Export email configuration
export const emailConfig = {
	from: `${BRAND_CONFIG.name} <noreply@${BRAND_CONFIG.email?.split("@")[1] || "example.com"}>`,
	domain: BRAND_CONFIG.email?.split("@")[1] || "example.com",
	supportEmail: BRAND_CONFIG.email,
} as const;

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
	data: WelcomeEmailData,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
	try {
		const result = await resend.emails.send({
			from: emailConfig.from,
			to: data.email,
			subject: `Bem-vindo ao ${BRAND_CONFIG.name}!`,
			react: WelcomeEmail(data),
		});

		if (result.error) {
			console.error("Welcome email send error:", result.error);
			return { success: false, error: result.error.message };
		}

		return { success: true, messageId: result.data?.id };
	} catch (error) {
		console.error("Welcome email send error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
	data: PasswordResetEmailData,
	email: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
	try {
		const result = await resend.emails.send({
			from: emailConfig.from,
			to: email,
			subject: "Redefinir sua senha",
			react: PasswordResetEmail(data),
		});

		if (result.error) {
			console.error("Password reset email send error:", result.error);
			return { success: false, error: result.error.message };
		}

		return { success: true, messageId: result.data?.id };
	} catch (error) {
		console.error("Password reset email send error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
	data: OrderConfirmationEmailData,
	email: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
	try {
		const result = await resend.emails.send({
			from: emailConfig.from,
			to: email,
			subject: `Confirmação do pedido #${data.orderNumber}`,
			react: OrderConfirmationEmail(data),
		});

		if (result.error) {
			console.error("Order confirmation email send error:", result.error);
			return { success: false, error: result.error.message };
		}

		return { success: true, messageId: result.data?.id };
	} catch (error) {
		console.error("Order confirmation email send error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Send order update email
 */
export async function sendOrderUpdateEmail(
	data: OrderUpdateEmailData,
	email: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
	try {
		const result = await resend.emails.send({
			from: emailConfig.from,
			to: email,
			subject: `Atualização do pedido #${data.orderNumber}`,
			react: OrderUpdateEmail(data),
		});

		if (result.error) {
			console.error("Order update email send error:", result.error);
			return { success: false, error: result.error.message };
		}

		return { success: true, messageId: result.data?.id };
	} catch (error) {
		console.error("Order update email send error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
