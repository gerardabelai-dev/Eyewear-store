import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
	useAddGlassesWithLensesToCart,
	useAddProductToCart,
	useCreateCart,
} from "@/http/cart/mutations";
import { useCartStore } from "@/stores/cart-store";

interface CartItem {
	productId: string;
	quantity: number;
}

interface GlassesWithLensesItem {
	glassesProductId: string;
	lensProductIds: string[];
	quantity: number;
}

export const useCart = () => {
	const _queryClient = useQueryClient();
	const { cartId, setCartId, clearCartId } = useCartStore();
	const createCartMutation = useCreateCart();
	const addProductToCartMutation = useAddProductToCart();
	const addGlassesWithLensesToCartMutation = useAddGlassesWithLensesToCart();

	const addItem = useCallback(
		async (item: CartItem): Promise<{ cartId: string }> => {
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

				return { cartId: activeCartId };
			} catch (error: any) {
				// If cart not found, clear the stale cart ID and retry once
				if (error?.message === "Carrinho não encontrado" && activeCartId) {
					console.log(
						"Cart: Stored cart not found, clearing and creating new cart",
					);
					clearCartId();

					// Create new cart
					const response = await createCartMutation.mutateAsync();
					setCartId(response.cart.id);
					activeCartId = response.cart.id;
					console.log("Cart: New cart created with ID:", activeCartId);

					// Retry adding product
					await addProductToCartMutation.mutateAsync({
						cartId: activeCartId,
						productId: item.productId,
						quantity: item.quantity,
					});

					return { cartId: activeCartId };
				}

				console.error("Cart: Failed to add product to cart", error);
				throw error;
			}
		},
		[
			cartId,
			setCartId,
			clearCartId,
			createCartMutation,
			addProductToCartMutation,
		],
	);

	const addGlassesWithLenses = useCallback(
		async (item: GlassesWithLensesItem): Promise<{ cartId: string }> => {
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

			// Add glasses with lenses to cart on server
			try {
				await addGlassesWithLensesToCartMutation.mutateAsync({
					cartId: activeCartId,
					glassesProductId: item.glassesProductId,
					lensProductIds: item.lensProductIds,
					quantity: item.quantity,
				});
				console.log("Cart: Glasses with lenses added to server cart", {
					cartId: activeCartId,
					glassesProductId: item.glassesProductId,
					lensProductIds: item.lensProductIds,
					quantity: item.quantity,
				});

				return { cartId: activeCartId };
			} catch (error: any) {
				// If cart not found, clear the stale cart ID and retry once
				if (error?.message === "Carrinho não encontrado" && activeCartId) {
					console.log(
						"Cart: Stored cart not found, clearing and creating new cart",
					);
					clearCartId();

					// Create new cart
					const response = await createCartMutation.mutateAsync();
					setCartId(response.cart.id);
					activeCartId = response.cart.id;
					console.log("Cart: New cart created with ID:", activeCartId);

					// Retry adding glasses
					await addGlassesWithLensesToCartMutation.mutateAsync({
						cartId: activeCartId,
						glassesProductId: item.glassesProductId,
						lensProductIds: item.lensProductIds,
						quantity: item.quantity,
					});

					return { cartId: activeCartId };
				}

				console.error("Cart: Failed to add glasses with lenses to cart", error);
				throw error;
			}
		},
		[
			cartId,
			setCartId,
			clearCartId,
			createCartMutation,
			addGlassesWithLensesToCartMutation,
		],
	);

	return {
		cartId,
		addItem,
		addGlassesWithLenses,
		clearCartId,
		isCreatingCart: createCartMutation.isPending,
		isAddingProduct: addProductToCartMutation.isPending,
		isAddingGlassesWithLenses: addGlassesWithLensesToCartMutation.isPending,
	};
};
