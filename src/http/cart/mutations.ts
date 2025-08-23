import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { QUERY_KEYS } from "@/http/query-keys";

import type {
	AddProductToCartResponse,
	CreateCartResponse,
	RemoveProductFromCartResponse,
} from "@/http/types";

export const useCreateCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (): Promise<CreateCartResponse> => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/carts/create-cart`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.FAILED_TO_CREATE_CART);
			}

			return await response.json();
		},
		onSuccess: (data) => {
			// Cache the new cart data
			queryClient.setQueryData(QUERY_KEYS.cart(data.cart.id), {
				id: data.cart.id,
				items: [],
				createdAt: data.cart.createdAt,
				updatedAt: data.cart.updatedAt,
			});
		},
	});
};

export const useAddProductToCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			cartId,
			productId,
			quantity = 1,
		}: {
			cartId: string;
			productId: string;
			quantity?: number;
		}): Promise<AddProductToCartResponse> => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/carts/${cartId}/add-product`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ productId, quantity }),
				},
			);

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.FAILED_TO_ADD_PRODUCT_TO_CART);
			}

			return await response.json();
		},
		onSuccess: (_, variables) => {
			// Invalidate cart query to refetch updated cart data
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.cart(variables.cartId),
			});
		},
	});
};

export const useRemoveProductFromCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			cartId,
			productId,
		}: {
			cartId: string;
			productId: string;
		}): Promise<RemoveProductFromCartResponse> => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/carts/${cartId}/remove-product`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ productId }),
				},
			);

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.FAILED_TO_REMOVE_PRODUCT_FROM_CART);
			}

			return await response.json();
		},
		onSuccess: (_, variables) => {
			// Invalidate cart query to refetch updated cart data
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.cart(variables.cartId),
			});
		},
	});
};
