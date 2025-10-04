import { queryOptions } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { QUERY_KEYS } from "@/http/query-keys";
import type { ListOrderDeliveryMethodsResponse } from "@/http/types";

export const getOrderDeliveryMethodsQueryOptions = () =>
	queryOptions({
		queryKey: QUERY_KEYS.orderDeliveryMethods(),
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/order-delivery-methods`,
			);

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.ORDER_DELIVERY_METHODS_NOT_FOUND);
			}

			const { orderDeliveryMethods } =
				(await response.json()) as ListOrderDeliveryMethodsResponse;

			return orderDeliveryMethods;
		},
	});
