import "server-only";
import { Client } from "@upstash/qstash";
import { serverEnv } from "./env";

// Initialize QStash client
export const qstashClient = new Client({
	token: serverEnv.QSTASH_TOKEN,
});

// QStash configuration
export const qstashConfig = {
	url: serverEnv.QSTASH_URL,
	currentSigningKey: serverEnv.QSTASH_CURRENT_SIGNING_KEY,
	nextSigningKey: serverEnv.QSTASH_NEXT_SIGNING_KEY,
} as const;

// Job types for type safety
export type JobType =
	| "send-welcome-email"
	| "send-order-confirmation"
	| "send-password-reset"
	| "send-order-update"
	| "process-order"
	| "cleanup-expired-sessions";

// Queue configuration for different job types
export const queueConfig = {
	"send-welcome-email": {
		maxRetries: 3,
		delay: 0,
	},
	"send-order-confirmation": {
		maxRetries: 3,
		delay: 5, // 5 seconds delay to ensure order is fully processed
	},
	"send-password-reset": {
		maxRetries: 2,
		delay: 0,
	},
	"send-order-update": {
		maxRetries: 3,
		delay: 0,
	},
	"process-order": {
		maxRetries: 5,
		delay: 10, // 10 seconds delay
	},
	"cleanup-expired-sessions": {
		maxRetries: 1,
		delay: 0,
	},
} as const;

// Utility function to enqueue a job
export async function enqueueJob<T = unknown>(
	jobType: JobType,
	payload: T,
	options?: {
		delay?: number;
		maxRetries?: number;
		headers?: Record<string, string>;
	},
) {
	const config = queueConfig[jobType];
	const endpoint = `${serverEnv.NEXT_PUBLIC_APP_URL}/api/jobs/${jobType}`;

	try {
		const result = await qstashClient.publishJSON({
			url: endpoint,
			body: payload,
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			delay: options?.delay ?? config.delay,
			retries: options?.maxRetries ?? config.maxRetries,
		});

		console.log(`Job ${jobType} enqueued successfully:`, result.messageId);
		return result;
	} catch (error) {
		console.error(`Failed to enqueue job ${jobType}:`, error);
		throw new Error(`Failed to enqueue job ${jobType}: ${error}`);
	}
}

// Utility function to verify QStash signature
export async function verifyQStashSignature(
	signature: string,
	body: string,
	url: string,
): Promise<boolean> {
	try {
		// QStash signature verification using the Receiver
		const { Receiver } = await import("@upstash/qstash");
		const receiver = new Receiver({
			currentSigningKey: serverEnv.QSTASH_CURRENT_SIGNING_KEY,
			nextSigningKey: serverEnv.QSTASH_NEXT_SIGNING_KEY,
		});

		await receiver.verify({
			signature,
			body,
			url,
		});

		return true;
	} catch (error) {
		console.error("Failed to verify QStash signature:", error);
		return false;
	}
}

// Job payload types for type safety
export interface SendWelcomeEmailPayload {
	userId: string;
	email: string;
	name: string;
	unsubscribeUrl: string;
	notificationId: string;
}

// Email job payload for the unified email processor
export interface EmailJobPayload {
	type: "welcome" | "password-reset" | "order-confirmation" | "order-update";
	userId?: string;
	email: string;
	data: Record<string, any>;
	notificationId?: string;
}

// Function to enqueue email jobs through the unified processor
export async function enqueueEmailJob(
	payload: EmailJobPayload,
	options?: {
		delay?: number;
		maxRetries?: number;
		headers?: Record<string, string>;
	},
) {
	const endpoint = `${serverEnv.NEXT_PUBLIC_APP_URL}/api/jobs/process-email`;

	try {
		const result = await qstashClient.publishJSON({
			url: endpoint,
			body: payload,
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			delay: options?.delay ?? 0,
			retries: options?.maxRetries ?? 3,
		});

		console.log(
			`Email job ${payload.type} enqueued successfully:`,
			result.messageId,
		);
		return result;
	} catch (error) {
		console.error(`Failed to enqueue email job ${payload.type}:`, error);
		throw new Error(`Failed to enqueue email job ${payload.type}: ${error}`);
	}
}

export interface SendOrderConfirmationPayload {
	orderId: string;
	userId: string;
	email: string;
	orderDetails: {
		total: number;
		items: Array<{
			name: string;
			quantity: number;
			price: number;
		}>;
	};
	unsubscribeUrl: string;
	notificationId: string;
}

export interface SendPasswordResetPayload {
	email: string;
	resetToken: string;
	name?: string;
	unsubscribeUrl: string;
	notificationId: string;
}

export interface SendOrderUpdatePayload {
	orderId: string;
	userId: string;
	email: string;
	status: string;
	message?: string;
	unsubscribeUrl: string;
	notificationId: string;
}

export interface ProcessOrderPayload {
	orderId: string;
	userId: string;
}

export interface CleanupExpiredSessionsPayload {
	cutoffDate: string;
}
