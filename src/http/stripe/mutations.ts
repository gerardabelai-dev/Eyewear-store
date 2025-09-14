import { useMutation } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import type {
	CreatePaymentIntentRequest,
	CreatePaymentIntentResponse,
	CreatePaymentMethodRequest,
	CreatePaymentMethodResponse,
} from "@/http/types";
import { handleApiError } from "@/lib/utils/handle-api-error";

export const useCreatePaymentIntentMutation = (options?: {
	onSuccess?: (data: CreatePaymentIntentResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: CreatePaymentIntentRequest,
		): Promise<CreatePaymentIntentResponse> => {
			const response = await fetch("/api/stripe/payment-intents/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				await handleApiError(
					response,
					ERROR_CODES.FAILED_TO_CREATE_ORDER_PAYMENT,
				);
			}

			return await response.json();
		},
		...options,
	});

export const useCreatePaymentMethodMutation = (options?: {
	onSuccess?: (data: CreatePaymentMethodResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: CreatePaymentMethodRequest,
		): Promise<CreatePaymentMethodResponse> => {
			const response = await fetch("/api/stripe/payment-methods/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				await handleApiError(response, "Failed to create payment method");
			}

			return await response.json();
		},
		...options,
	});
