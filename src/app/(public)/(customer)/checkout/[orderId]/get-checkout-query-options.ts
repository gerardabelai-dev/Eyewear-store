import { queryOptions } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";

export const getOrderByIdQueryOptions = (orderId: string) =>
	queryOptions({
		queryKey: ["order", { id: orderId }],
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/orders/${orderId}/get-order-by-id`,
			);

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.FAILED_TO_GET_CHECKOUT);
			}

			return await response.json();
		},
	});
