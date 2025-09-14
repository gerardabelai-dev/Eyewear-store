import { useMutation } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import type {
	CreateOrderDeliveryRequest,
	CreateOrderDeliveryResponse,
	UpdateOrderDeliveryRequest,
	UpdateOrderDeliveryResponse,
} from "@/http/types";
import { handleApiError } from "@/lib/utils/handle-api-error";

export const useCreateOrderDeliveryMutation = (options?: {
	onSuccess?: (data: CreateOrderDeliveryResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: CreateOrderDeliveryRequest,
		): Promise<CreateOrderDeliveryResponse> => {
			const response = await fetch(
				"/api/order-deliveries/create-order-delivery",
				{
					method: "POST",
					body: JSON.stringify(data),
				},
			);

			if (!response.ok) {
				await handleApiError(
					response,
					ERROR_CODES.FAILED_TO_CREATE_ORDER_DELIVERY,
				);
			}

			return await response.json();
		},
		...options,
	});

export const useUpdateOrderDeliveryMutation = (options?: {
	onSuccess?: (data: UpdateOrderDeliveryResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: UpdateOrderDeliveryRequest,
		): Promise<UpdateOrderDeliveryResponse> => {
			const response = await fetch(
				"/api/order-deliveries/update-order-delivery",
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				},
			);

			if (!response.ok) {
				await handleApiError(
					response,
					ERROR_CODES.FAILED_TO_CREATE_ORDER_DELIVERY,
				);
			}

			return await response.json();
		},
		...options,
	});
