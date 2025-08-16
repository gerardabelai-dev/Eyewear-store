import { useMutation } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import type {
	CreateOrderDeliveryRequest,
	CreateOrderDeliveryResponse,
} from "@/http/types";

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
				console.error(response);
				throw new Error(ERROR_CODES.FAILED_TO_CREATE_ORDER_DELIVERY);
			}

			return await response.json();
		},
		...options,
	});
