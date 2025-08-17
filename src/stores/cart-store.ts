import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
	cartId: string | null;
	setCartId: (cartId: string) => void;
	clearCartId: () => void;
}

export const useCartStore = create<CartState>()(
	persist(
		(set) => ({
			cartId: null,
			setCartId: (cartId: string) =>
				set(() => {
					console.log("Cart: Setting cart ID", { cartId });
					return { cartId };
				}),
			clearCartId: () =>
				set(() => {
					console.log("Cart: Clearing cart ID");
					return { cartId: null };
				}),
		}),
		{
			name: "cart-storage", // localStorage key
		},
	),
);
