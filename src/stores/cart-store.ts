import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
	productId: string;
	quantity: number;
}

interface CartState {
	cartId: string | null;
	items: CartItem[];
	addItem: (item: CartItem) => void;
	removeItem: (item: CartItem) => void;
	clear: () => void;
}

export const useCartStore = create<CartState>()(
	persist(
		(set) => ({
			cartId: null,
			items: [],
			addItem: (item: CartItem) =>
				set((state) => {
					const newItems = [...state.items, item];
					console.log("Cart: Adding item", { item, newItems });
					return { items: newItems };
				}),
			removeItem: (item: CartItem) =>
				set((state) => {
					const newItems = state.items.filter(
						(i) => i.productId !== item.productId,
					);
					console.log("Cart: Removing item", { item, newItems });
					return { items: newItems };
				}),
			clear: () =>
				set(() => {
					console.log("Cart: Clearing all items");
					return { items: [] };
				}),
		}),
		{
			name: "cart-storage", // localStorage key
		},
	),
);
