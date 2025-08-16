import { queryOptions } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { queryKeys } from "@/http/query-keys";
import type { ListOrderPaymentMethodsResponse } from "@/http/types";

export const getOrderPaymentMethodsQueryOptions = () =>
	queryOptions({
		queryKey: queryKeys.orderPaymentMethods(),
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/order-payment-methods/list-all`,
			);

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.ORDER_PAYMENT_METHODS_NOT_FOUND);
			}

			const { orderPaymentMethods } =
				(await response.json()) as ListOrderPaymentMethodsResponse;

			return orderPaymentMethods;
		},
	});
