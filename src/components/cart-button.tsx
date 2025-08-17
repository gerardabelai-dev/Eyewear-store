"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
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
	const { data: cart } = useSuspenseQuery(getCartQueryOptions(cartId));
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
