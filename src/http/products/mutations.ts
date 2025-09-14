import { useMutation } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import type {
	CreateOrderFromCartRequest,
	CreateOrderFromCartResponse,
	UpdateOrderCustomerAddressIdRequest,
	UpdateOrderCustomerAddressIdResponse,
	UpdateOrderCustomerIdRequest,
	UpdateOrderCustomerIdResponse,
} from "@/http/types";
import { handleApiError } from "@/lib/utils/handle-api-error";

export const useCreateOrderFromCartMutation = (options?: {
	onSuccess?: (data: CreateOrderFromCartResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: CreateOrderFromCartRequest,
		): Promise<CreateOrderFromCartResponse> => {
			const response = await fetch(`/api/orders/create-order-from-cart-id`, {
				method: "POST",
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.FAILED_TO_CREATE_ORDER);
			}

			return await response.json();
		},
		...options,
	});

export const useUpdateOrderCustomerIdMutation = (options?: {
	onSuccess?: (data: UpdateOrderCustomerIdResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: UpdateOrderCustomerIdRequest,
		): Promise<UpdateOrderCustomerIdResponse> => {
			const response = await fetch(
				`/api/orders/${data.orderId}/update-order-customer-id`,
				{
					method: "POST",
					body: JSON.stringify(data),
				},
			);

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.FAILED_TO_UPDATE_ORDER);
			}

			return await response.json();
		},
		...options,
	});

export const useUpdateOrderCustomerAddressIdMutation = (options?: {
	onSuccess?: (data: UpdateOrderCustomerAddressIdResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: UpdateOrderCustomerAddressIdRequest,
		): Promise<UpdateOrderCustomerAddressIdResponse> => {
			const response = await fetch(
				`/api/orders/${data.orderId}/update-order-customer-address-id`,
				{
					method: "POST",
					body: JSON.stringify(data),
				},
			);

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.FAILED_TO_UPDATE_ORDER);
			}

			return await response.json();
		},
		...options,
	});
