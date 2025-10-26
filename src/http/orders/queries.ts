import { queryOptions } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { QUERY_KEYS } from "@/http/query-keys";
import type {
	GetCustomerOrdersResponse,
	GetOrderDeliveryResponse,
	GetOrderResponse,
} from "@/http/types";
import { handleApiError } from "@/lib/utils/handle-api-error";

export const getOrderByIdQueryOptions = (orderId: string) =>
	queryOptions({
		queryKey: QUERY_KEYS.order(orderId),
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/orders/${orderId}`,
			);

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.FAILED_TO_GET_ORDER_DETAILS);
			}

			const { order } = (await response.json()) as GetOrderResponse;

			return order;
		},
	});

export const getOrderDeliveryQueryOptions = (orderId: string) =>
	queryOptions({
		queryKey: QUERY_KEYS.orderDelivery(orderId),
		queryFn: async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_WEB_URL}/api/orders/${orderId}/get-order-delivery`,
				);

				// If delivery doesn't exist yet (404), return null instead of throwing
				if (response.status === 404) {
					return null;
				}

				if (!response.ok) {
					console.error(
						"Order delivery fetch failed:",
						response.status,
						response.statusText,
					);
					// For other HTTP errors, still return null to avoid breaking the UI
					return null;
				}

				const { orderDelivery } =
					(await response.json()) as GetOrderDeliveryResponse;

				return orderDelivery;
			} catch (error) {
				// If it's a network error or fetch fails, return null gracefully
				console.warn("Order delivery query failed, returning null:", error);
				return null;
			}
		},
		retry: false, // Don't retry since missing delivery is expected initially
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: false, // Avoid unnecessary refetches
	});

export const getCustomerOrdersQueryOptions = () =>
	queryOptions({
		queryKey: QUERY_KEYS.customerOrders(),
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/orders/my-orders`,
			);

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.FAILED_TO_GET_ORDER_DETAILS);
			}

			const { orders } = (await response.json()) as GetCustomerOrdersResponse;

			return orders;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh for 5 minutes
		gcTime: 1000 * 60 * 10, // 10 minutes - cache persists for 10 minutes
		refetchOnMount: false, // Don't refetch if data is still fresh
		refetchOnWindowFocus: false, // Don't refetch on window focus
	});
