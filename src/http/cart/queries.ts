import { queryOptions } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { QUERY_KEYS } from "@/http/query-keys";
import type { GetCartResponse } from "@/http/types";
import { handleApiError } from "@/lib/utils/handle-api-error";

export const getCartQueryOptions = (cartId: string) =>
	queryOptions({
		queryKey: QUERY_KEYS.cart(cartId),
		queryFn: async (): Promise<GetCartResponse> => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/carts/${cartId}`,
			);

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.FAILED_TO_GET_CART);
			}

			return await response.json();
		},
	});
