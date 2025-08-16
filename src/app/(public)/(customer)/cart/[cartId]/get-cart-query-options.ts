import { queryOptions } from "@tanstack/react-query";

export const getCartQueryOptions = (cartId: string) =>
	queryOptions({
		queryKey: ["cart", { id: cartId }],
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/carts/${cartId}/get-cart-by-id`,
			);
			if (!response.ok) {
				console.error(response);
			}
			const data = await response.json();
			return data;
		},
	});
