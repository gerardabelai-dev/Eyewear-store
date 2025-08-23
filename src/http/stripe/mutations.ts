import { useMutation } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import type {
	CreatePaymentIntentRequest,
	CreatePaymentIntentResponse,
} from "@/http/types";

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
				console.error(response);
				throw new Error(ERROR_CODES.FAILED_TO_CREATE_ORDER_PAYMENT);
			}

			return await response.json();
		},
		...options,
	});
