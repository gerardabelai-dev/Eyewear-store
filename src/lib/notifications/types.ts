/**
 * Notification System Types and Constants
 * Centralized definitions for all notification-related types
 */

// Notification types enum
export const NotificationType = {
	MARKETING: "marketing",
	ORDER_UPDATES: "order_updates",
	SYSTEM_NOTIFICATIONS: "system_notifications",
	TRANSACTIONAL: "transactional",
	PROMOTIONS: "promotions",
	NEWSLETTERS: "newsletters",
} as const;

export type NotificationType =
	(typeof NotificationType)[keyof typeof NotificationType];

// Notification channels enum
export const NotificationChannel = {
	EMAIL: "email",
	SMS: "sms",
	PUSH: "push",
	WHATSAPP: "whatsapp",
	WEB: "web",
} as const;

export type NotificationChannel =
	(typeof NotificationChannel)[keyof typeof NotificationChannel];

// Notification status enum
export const NotificationStatus = {
	PENDING: "pending",
	SENT: "sent",
	DELIVERED: "delivered",
	FAILED: "failed",
	OPENED: "opened",
	CLICKED: "clicked",
} as const;

export type NotificationStatus =
	(typeof NotificationStatus)[keyof typeof NotificationStatus];

// External providers enum
export const NotificationProvider = {
	RESEND: "resend",
	TWILIO: "twilio",
	FIREBASE: "firebase",
	SLACK: "slack",
	DISCORD: "discord",
} as const;

export type NotificationProvider =
	(typeof NotificationProvider)[keyof typeof NotificationProvider];

// Email specific types for templates
export const EmailTemplate = {
	WELCOME: "welcome",
	ORDER_CONFIRMATION: "order_confirmation",
	PASSWORD_RESET: "password_reset",
	ORDER_UPDATE: "order_update",
	NEWSLETTER: "newsletter",
	PROMOTION: "promotion",
	SYSTEM_ALERT: "system_alert",
} as const;

export type EmailTemplate = (typeof EmailTemplate)[keyof typeof EmailTemplate];

// Notification preference interface
export interface NotificationPreferences {
	marketing: boolean;
	orderUpdates: boolean;
	systemNotifications: boolean;
	promotions: boolean;
	newsletters: boolean;
	emailEnabled: boolean;
	smsEnabled: boolean;
	pushEnabled: boolean;
	whatsappEnabled: boolean;
}

// Notification metadata interface
export interface NotificationMetadata {
	templateId?: string;
	templateData?: Record<string, any>;
	priority?: "low" | "normal" | "high" | "urgent";
	tags?: string[];
	campaignId?: string;
	orderId?: string;
	productId?: string;
	categoryId?: string;
	[key: string]: any;
}

// Notification creation payload
export interface CreateNotificationPayload {
	userId: string;
	notificationType: NotificationType;
	channel: NotificationChannel;
	subject?: string;
	content: string;
	metadata?: NotificationMetadata;
	externalProvider?: NotificationProvider;
	scheduledFor?: Date;
}

// Email template data interfaces
export interface WelcomeEmailData {
	name: string;
	email: string;
	unsubscribeUrl: string;
}

export interface OrderConfirmationEmailData {
	orderNumber: string;
	customerName: string;
	total: number;
	items: Array<{
		name: string;
		quantity: number;
		price: number;
	}>;
	unsubscribeUrl: string;
}

export interface PasswordResetEmailData {
	name?: string;
	resetUrl: string;
	expiresIn?: string;
	unsubscribeUrl: string;
}

export interface OrderUpdateEmailData {
	orderNumber: string;
	customerName: string;
	status: string;
	message?: string;
	trackingUrl?: string;
	unsubscribeUrl: string;
}

export interface NewsletterEmailData {
	name: string;
	content: string;
	ctaUrl?: string;
	ctaText?: string;
	unsubscribeUrl: string;
}

export interface PromotionEmailData {
	name: string;
	title: string;
	description: string;
	discountCode?: string;
	discountAmount?: string;
	expiresAt?: Date;
	ctaUrl: string;
	ctaText: string;
	unsubscribeUrl: string;
}

// Unsubscribe token payload
export interface UnsubscribeTokenPayload {
	userId: string;
	notificationId: string;
	email: string;
	iat: number; // issued at
}

// User preference update payload
export interface UpdatePreferencesPayload {
	userId: string;
	preferences: Partial<NotificationPreferences>;
	unsubscribeFromAll?: boolean;
}

// Notification filtering options
export interface NotificationFilters {
	userId?: string;
	notificationType?: NotificationType;
	channel?: NotificationChannel;
	status?: NotificationStatus;
	dateFrom?: Date;
	dateTo?: Date;
	externalProvider?: NotificationProvider;
}

// Notification analytics interface
export interface NotificationAnalytics {
	totalSent: number;
	totalDelivered: number;
	totalOpened: number;
	totalClicked: number;
	totalFailed: number;
	deliveryRate: number;
	openRate: number;
	clickRate: number;
	failureRate: number;
	byType: Record<
		NotificationType,
		{
			sent: number;
			delivered: number;
			opened: number;
			clicked: number;
			failed: number;
		}
	>;
	byChannel: Record<
		NotificationChannel,
		{
			sent: number;
			delivered: number;
			opened: number;
			clicked: number;
			failed: number;
		}
	>;
}

// Constants for notification system
export const NOTIFICATION_CONSTANTS = {
	DEFAULT_UNSUBSCRIBE_TOKEN_EXPIRY: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
	MAX_NOTIFICATION_CONTENT_LENGTH: 5000,
	MAX_SUBJECT_LENGTH: 255,
	DEFAULT_RETRY_ATTEMPTS: 3,
	DEFAULT_RETRY_DELAY: 5000, // 5 seconds
	TRANSACTIONAL_TYPES: [
		"transactional",
		// Password reset is always transactional
	] as const,
	MARKETING_TYPES: ["marketing", "promotions", "newsletters"] as const,
	SYSTEM_TYPES: ["system_notifications", "order_updates"] as const,
} as const;

// Helper functions for type checking
export const isTransactionalNotification = (
	type: NotificationType,
): boolean => {
	return (
		NOTIFICATION_CONSTANTS.TRANSACTIONAL_TYPES as readonly string[]
	).includes(type);
};

export const isMarketingNotification = (type: NotificationType): boolean => {
	return (NOTIFICATION_CONSTANTS.MARKETING_TYPES as readonly string[]).includes(
		type,
	);
};

export const isSystemNotification = (type: NotificationType): boolean => {
	return (NOTIFICATION_CONSTANTS.SYSTEM_TYPES as readonly string[]).includes(
		type,
	);
};

// Export all types and constants
export default {
	NotificationType,
	NotificationChannel,
	NotificationStatus,
	NotificationProvider,
	EmailTemplate,
	NOTIFICATION_CONSTANTS,
	isTransactionalNotification,
	isMarketingNotification,
	isSystemNotification,
};
