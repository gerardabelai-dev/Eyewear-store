import { queryOptions } from "@tanstack/react-query";

export const getCartQueryOptions = queryOptions({
	queryKey: ["cart", { id: "1" }],
	queryFn: async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_WEB_URL}/api/cart`);
		return response.json() as Promise<{
			id: string;
			items: { id: string }[];
		}>;
	},
});
