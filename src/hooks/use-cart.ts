import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useAddProductToCart, useCreateCart } from "@/http/cart/mutations";
import { useCartStore } from "@/stores/cart-store";

interface CartItem {
	productId: string;
	quantity: number;
}

export const useCart = () => {
	const _queryClient = useQueryClient();
	const { cartId, setCartId, clearCartId } = useCartStore();
	const createCartMutation = useCreateCart();
	const addProductToCartMutation = useAddProductToCart();

	const addItem = useCallback(
		async (item: CartItem) => {
			let activeCartId = cartId;

			// If no cartId exists, create a new cart first
			if (!activeCartId) {
				console.log("Cart: No cartId found, creating new cart");
				try {
					const response = await createCartMutation.mutateAsync();
					setCartId(response.cart.id);
					activeCartId = response.cart.id;
					console.log("Cart: New cart created with ID:", activeCartId);
				} catch (error) {
					console.error("Cart: Failed to create cart", error);
					throw error;
				}
			}

			// Add product to cart on server
			try {
				await addProductToCartMutation.mutateAsync({
					cartId: activeCartId,
					productId: item.productId,
					quantity: item.quantity,
				});
				console.log("Cart: Product added to server cart", {
					cartId: activeCartId,
					productId: item.productId,
					quantity: item.quantity,
				});
			} catch (error) {
				console.error("Cart: Failed to add product to cart", error);
				throw error;
			}
		},
		[cartId, setCartId, createCartMutation, addProductToCartMutation],
	);

	return {
		cartId,
		addItem,
		clearCartId,
		isCreatingCart: createCartMutation.isPending,
		isAddingProduct: addProductToCartMutation.isPending,
	};
};
