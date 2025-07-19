import { nanoid } from "nanoid";
import type {
	CreateNotificationPayload,
	NotificationChannel,
	NotificationType,
} from "./notifications/types";
import type {
	CleanupExpiredSessionsPayload,
	ProcessOrderPayload,
	SendOrderConfirmationPayload,
	SendOrderUpdatePayload,
	SendPasswordResetPayload,
	SendWelcomeEmailPayload,
} from "./qstash";
import { enqueueJob } from "./qstash";
import { generateUnsubscribeUrl } from "./resend";

/**
 * Queue Service - Utility functions to integrate QStash with existing actions
 * These functions can be called from your existing user and order actions
 */

// User-related email queue functions
export async function queueWelcomeEmail(
	userId: string,
	email: string,
	name: string,
) {
	// Generate notification ID for tracking
	const notificationId = nanoid();
	const unsubscribeUrl = generateUnsubscribeUrl(userId, notificationId);

	const payload: SendWelcomeEmailPayload = {
		userId,
		email,
		name,
		unsubscribeUrl,
		notificationId,
	};

	return enqueueJob("send-welcome-email", payload);
}

export async function queuePasswordResetEmail(
	userId: string,
	email: string,
	resetToken: string,
	name?: string,
) {
	// Generate notification ID for tracking
	const notificationId = nanoid();
	const unsubscribeUrl = generateUnsubscribeUrl(userId, notificationId);

	const payload: SendPasswordResetPayload = {
		email,
		resetToken,
		name,
		unsubscribeUrl,
		notificationId,
	};

	return enqueueJob("send-password-reset", payload);
}

// Order-related queue functions
export async function queueOrderProcessing(orderId: string, userId: string) {
	const payload: ProcessOrderPayload = {
		orderId,
		userId,
	};

	return enqueueJob("process-order", payload, {
		delay: 5, // 5 second delay to ensure order is fully saved
	});
}

export async function queueOrderConfirmationEmail(
	orderId: string,
	userId: string,
	email: string,
	orderDetails: {
		total: number;
		items: Array<{
			name: string;
			quantity: number;
			price: number;
		}>;
	},
) {
	// Generate notification ID for tracking
	const notificationId = nanoid();
	const unsubscribeUrl = generateUnsubscribeUrl(userId, notificationId);

	const payload: SendOrderConfirmationPayload = {
		orderId,
		userId,
		email,
		orderDetails,
		unsubscribeUrl,
		notificationId,
	};

	return enqueueJob("send-order-confirmation", payload, {
		delay: 10, // 10 second delay to ensure order is processed
	});
}

export async function queueOrderUpdateEmail(
	orderId: string,
	userId: string,
	email: string,
	status: string,
	message?: string,
) {
	// Generate notification ID for tracking
	const notificationId = nanoid();
	const unsubscribeUrl = generateUnsubscribeUrl(userId, notificationId);

	const payload: SendOrderUpdatePayload = {
		orderId,
		userId,
		email,
		status,
		message,
		unsubscribeUrl,
		notificationId,
	};

	return enqueueJob("send-order-update", payload);
}

// System maintenance queue functions
export async function queueSessionCleanup(daysOld = 30) {
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - daysOld);

	const payload: CleanupExpiredSessionsPayload = {
		cutoffDate: cutoffDate.toISOString(),
	};

	return enqueueJob("cleanup-expired-sessions", payload, {
		delay: 0,
		maxRetries: 1,
	});
}

// Batch operations
export async function queueMultipleEmails(
	emailJobs: Array<{
		type: "welcome" | "password-reset" | "order-confirmation" | "order-update";
		payload: any;
		delay?: number;
	}>,
) {
	const results = [];

	for (const job of emailJobs) {
		try {
			let result: any;
			switch (job.type) {
				case "welcome":
					result = await enqueueJob("send-welcome-email", job.payload, {
						delay: job.delay,
					});
					break;
				case "password-reset":
					result = await enqueueJob("send-password-reset", job.payload, {
						delay: job.delay,
					});
					break;
				case "order-confirmation":
					result = await enqueueJob("send-order-confirmation", job.payload, {
						delay: job.delay,
					});
					break;
				case "order-update":
					result = await enqueueJob("send-order-update", job.payload, {
						delay: job.delay,
					});
					break;
				default:
					throw new Error(`Unknown email job type: ${job.type}`);
			}
			results.push({ success: true, result });
		} catch (error) {
			console.error(`Failed to queue ${job.type} email:`, error);
			results.push({ success: false, error });
		}
	}

	return results;
}

// Utility functions for scheduling recurring jobs
export async function scheduleRecurringSessionCleanup() {
	// This could be called from a cron job or scheduled task
	return queueSessionCleanup(30); // Clean up sessions older than 30 days
}

// Error recovery functions
export async function retryFailedOrderProcessing(
	orderId: string,
	userId: string,
) {
	return queueOrderProcessing(orderId, userId);
}

export async function retryFailedEmailSend(
	type: "welcome" | "password-reset" | "order-confirmation" | "order-update",
	payload:
		| SendWelcomeEmailPayload
		| SendPasswordResetPayload
		| SendOrderConfirmationPayload
		| SendOrderUpdatePayload,
) {
	const jobType = `send-${type}` as
		| "send-welcome-email"
		| "send-password-reset"
		| "send-order-confirmation"
		| "send-order-update";
	return enqueueJob(jobType, payload, {
		maxRetries: 1, // Only retry once for manual retries
	});
}

// Integration helpers for existing actions
export const QueueService = {
	// User actions
	user: {
		sendWelcomeEmail: queueWelcomeEmail,
		sendPasswordResetEmail: queuePasswordResetEmail,
	},

	// Order actions
	order: {
		processOrder: queueOrderProcessing,
		sendConfirmationEmail: queueOrderConfirmationEmail,
		sendUpdateEmail: queueOrderUpdateEmail,
	},

	// System maintenance
	system: {
		cleanupSessions: queueSessionCleanup,
		scheduleRecurringCleanup: scheduleRecurringSessionCleanup,
	},

	// Batch operations
	batch: {
		sendMultipleEmails: queueMultipleEmails,
	},

	// Error recovery
	retry: {
		orderProcessing: retryFailedOrderProcessing,
		emailSend: retryFailedEmailSend,
	},
};

export default QueueService;
