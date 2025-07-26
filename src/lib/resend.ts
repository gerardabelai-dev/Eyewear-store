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

// Export email configuration
export const emailConfig = {
	from: `${BRAND_CONFIG.name} <noreply@${BRAND_CONFIG.email?.split("@")[1] || "example.com"}>`,
	domain: BRAND_CONFIG.email?.split("@")[1] || "example.com",
	supportEmail: BRAND_CONFIG.email,
} as const;
