import { queryOptions } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";

export const getCartQueryOptions = (cartId: string) =>
	queryOptions({
		queryKey: ["cart", { id: cartId }],
		queryFn: async () => {
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
