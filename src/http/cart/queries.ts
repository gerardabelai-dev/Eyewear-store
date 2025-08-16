import { queryOptions } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { queryKeys } from "@/http/query-keys";
import type { GetCartResponse } from "@/http/types";

export const getCartQueryOptions = (cartId: string) =>
	queryOptions({
		queryKey: queryKeys.cart(cartId),
		queryFn: async (): Promise<GetCartResponse> => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/carts/${cartId}/get-cart-by-id`,
			);

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.FAILED_TO_GET_CART);
			}

			return await response.json();
		},
	});
