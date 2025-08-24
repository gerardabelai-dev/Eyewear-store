"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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

	const isEmpty = !data.items || data.items.length === 0;

	// Calculate subtotal from all cart items
	const subtotalInCents = isEmpty
		? 0
		: data.items.reduce((total, item: CartItemData) => {
				return total + calculateItemTotal(item);
			}, 0);

	// Shipping and taxes will be calculated during checkout
	const shippingInCents = 0;
	const taxesInCents = 0;
	const totalInCents = subtotalInCents + shippingInCents + taxesInCents;

	return (
		<TooltipProvider>
			<div
				className={`flex flex-col gap-4 bg-muted p-8 rounded h-fit sticky top-14 ${isEmpty ? "opacity-60" : ""}`}
			>
				<h2 className="text-lg font-bold">Resumo da compra</h2>

				<div className="flex gap-2 justify-between">
					<span>Subtotal</span>
					<strong>{formatPrice(subtotalInCents)}</strong>
				</div>

				<Separator />

				<div className="flex gap-2 justify-between">
					<div className="flex items-center gap-1">
						<span>Frete</span>
						<Tooltip>
							<TooltipTrigger asChild>
								<HelpCircle className="size-4 text-muted-foreground cursor-help" />
							</TooltipTrigger>
							<TooltipContent>
								<p>
									O valor do frete será calculado no checkout com base no seu
									endereço
								</p>
							</TooltipContent>
						</Tooltip>
					</div>
					<strong>{formatPrice(shippingInCents)}</strong>
				</div>

				<Separator />

				<div className="flex gap-2 justify-between">
					<div className="flex items-center gap-1">
						<span>Taxas e impostos</span>
						<Tooltip>
							<TooltipTrigger asChild>
								<HelpCircle className="size-4 text-muted-foreground cursor-help" />
							</TooltipTrigger>
							<TooltipContent>
								<p>
									Taxas e impostos serão calculados no checkout conforme
									aplicável
								</p>
							</TooltipContent>
						</Tooltip>
					</div>
					<strong>{formatPrice(taxesInCents)}</strong>
				</div>

				<Separator />

				<div className="flex gap-2 justify-between">
					<span>Total</span>
					<strong>{formatPrice(totalInCents)}</strong>
				</div>

				<CreateOrderButton cartId={cartId} disabled={isEmpty} />
			</div>
		</TooltipProvider>
	);
}
