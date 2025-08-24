"use client";

import { useQuery } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { getCartQueryOptions } from "@/app/(public)/(customer)/cart/[cartId]/get-cart-query-options";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/stores/cart-store";

export function CartButton() {
	const cartId = useCartStore((state) => state.cartId);

	if (!cartId) {
		return (
			<Button variant="ghost" size="sm" className="relative">
				<ShoppingCart className="h-4 w-4" />
				<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
					0
				</span>
			</Button>
		);
	}

	return <CartButtonWithData cartId={cartId} />;
}

function CartButtonWithData({ cartId }: { cartId: string }) {
	const { clearCartId } = useCartStore();
	const { data: cart, error, isError } = useQuery(getCartQueryOptions(cartId));

	// Clear invalid cartId if cart doesn't exist
	useEffect(() => {
		if (isError && error?.message === "FAILED_TO_GET_CART") {
			console.log("Cart: Invalid cartId detected, clearing from storage");
			clearCartId();
		}
	}, [isError, error, clearCartId]);

	// Show empty cart while loading or if cart doesn't exist
	if (!cart || isError) {
		return (
			<Button variant="ghost" size="sm" className="relative">
				<ShoppingCart className="h-4 w-4" />
				<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
					0
				</span>
			</Button>
		);
	}

	const itemCount = cart.items.reduce(
		(total, item) => total + item.quantity,
		0,
	);

	return (
		<Link href={ROUTES.CART(cartId)}>
			<Button variant="ghost" size="sm" className="relative">
				<ShoppingCart className="h-4 w-4" />
				{itemCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
						{itemCount > 99 ? "99+" : itemCount}
					</span>
				)}
			</Button>
		</Link>
	);
}
