import { useMutation } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import type {
	CreateOrderPaymentRequest,
	CreateOrderPaymentResponse,
	UpdateOrderPaymentRequest,
	UpdateOrderPaymentResponse,
} from "@/http/types";
import { handleApiError } from "@/lib/utils/handle-api-error";

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
				await handleApiError(
					response,
					ERROR_CODES.FAILED_TO_CREATE_ORDER_PAYMENT,
				);
			}

			return await response.json();
		},
		...options,
	});

export const useUpdateOrderPaymentMutation = (options?: {
	onSuccess?: (data: UpdateOrderPaymentResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: UpdateOrderPaymentRequest,
		): Promise<UpdateOrderPaymentResponse> => {
			console.log("🔄 Sending order payment update request:", data);

			const response = await fetch("/api/order-payments/update-order-payment", {
				method: "PATCH",
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
