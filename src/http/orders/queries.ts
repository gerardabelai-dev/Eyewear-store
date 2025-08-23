import { queryOptions } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { QUERY_KEYS } from "@/http/query-keys";
import type { GetOrderDeliveryResponse, GetOrderResponse } from "@/http/types";

export const getOrderByIdQueryOptions = (orderId: string) =>
	queryOptions({
		queryKey: QUERY_KEYS.order(orderId),
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/orders/${orderId}/get-order-by-id`,
			);

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.FAILED_TO_GET_ORDER_DETAILS);
			}

			const { order } = (await response.json()) as GetOrderResponse;

			return order;
		},
	});

export const getOrderDeliveryQueryOptions = (orderId: string) =>
	queryOptions({
		queryKey: QUERY_KEYS.orderDelivery(orderId),
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/orders/${orderId}/get-order-delivery`,
			);

			// If delivery doesn't exist yet (404), return null instead of throwing
			if (response.status === 404) {
				return null;
			}

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.ORDER_DELIVERY_NOT_FOUND);
			}

			const { orderDelivery } =
				(await response.json()) as GetOrderDeliveryResponse;

			return orderDelivery;
		},
	});
