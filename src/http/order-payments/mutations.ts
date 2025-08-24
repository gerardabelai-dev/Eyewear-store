import { useMutation } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import type {
	CreateOrderPaymentRequest,
	CreateOrderPaymentResponse,
} from "@/http/types";

export const useCreateOrderPaymentMutation = (options?: {
	onSuccess?: (data: CreateOrderPaymentResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: CreateOrderPaymentRequest,
		): Promise<CreateOrderPaymentResponse> => {
			console.log("🔄 Sending order payment request:", data);

			const response = await fetch("/api/order-payments/create-order-payment", {
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
