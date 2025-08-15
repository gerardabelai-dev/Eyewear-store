import { queryOptions } from "@tanstack/react-query";

export const getCartQueryOptions = (cart_id: string) =>
	queryOptions({
		queryKey: ["cart", { id: cart_id }],
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/cart/${cart_id}`,
			);
			if (!response.ok) {
				console.error(response);
			}
			const data = await response.json();
			console.log(data);
			return data;
		},
	});
