"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import type { GetCartResponse } from "@/http/types";
import { calculateDiscountedPrice, formatPrice } from "@/lib/format-price";
import { CreateOrderButton } from "./create-order-button";
import { getCartQueryOptions } from "./get-cart-query-options";

type CartItemData = GetCartResponse["items"][0];

function calculateItemTotal(item: CartItemData): number {
	const discountedPrice = calculateDiscountedPrice(
		item.productPrice.priceInCents,
		item.productPrice.discountPercentage,
	);
	return discountedPrice * item.quantity;
}

export function CartSummary({ cartId }: { cartId: string }) {
	const { data } = useSuspenseQuery(getCartQueryOptions(cartId));

	if (!data.items || data.items.length === 0) {
		return null;
	}

	// Calculate subtotal from all cart items
	const subtotalInCents = data.items.reduce((total, item: CartItemData) => {
		return total + calculateItemTotal(item);
	}, 0);

	// For now, using fixed values for shipping and taxes
	// These could be calculated based on delivery method, location, etc.
	const shippingInCents = 1000; // R$ 10,00
	const taxesInCents = 1000; // R$ 10,00
	const totalInCents = subtotalInCents + shippingInCents + taxesInCents;

	return (
		<div className="flex flex-col gap-4 bg-muted p-8 rounded h-fit sticky top-14">
			<h2 className="text-lg font-bold">Resumo da compra</h2>

			<div className="flex gap-2 justify-between">
				<span>Subtotal</span>
				<strong>{formatPrice(subtotalInCents)}</strong>
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<span>Frete</span>
				<strong>{formatPrice(shippingInCents)}</strong>
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<span>Taxas e impostos</span>
				<strong>{formatPrice(taxesInCents)}</strong>
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<span>Total</span>
				<strong>{formatPrice(totalInCents)}</strong>
			</div>

			<CreateOrderButton cartId={cartId} />
		</div>
	);
}
