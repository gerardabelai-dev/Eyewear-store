"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

interface GroupedCartItem {
	glasses: CartItemData;
	lensOptions: CartItemData[];
	totalQuantity: number;
	combinationKey: string;
}

function calculateGroupTotal(groupedItem: GroupedCartItem): number {
	// Calculate glasses price
	const glassesPrice = calculateDiscountedPrice(
		groupedItem.glasses.productPrice.priceInCents,
		groupedItem.glasses.productPrice.discountPercentage,
	);

	// Calculate lens options price
	const lensOptionsPrice = groupedItem.lensOptions.reduce(
		(total, lensOption) => {
			const lensPrice = calculateDiscountedPrice(
				lensOption.productPrice.priceInCents,
				lensOption.productPrice.discountPercentage,
			);
			return total + lensPrice;
		},
		0,
	);

	// Total price per unit (glasses + all lens options) * quantity
	return (glassesPrice + lensOptionsPrice) * groupedItem.totalQuantity;
}

export function CartSummary({ cartId }: { cartId: string }) {
	const { data } = useSuspenseQuery(getCartQueryOptions(cartId));
	const router = useRouter();

	const isEmpty = !data.items || data.items.length === 0;

	const handleContinueShopping = () => {
		router.push("/");
	};

	// Group items by groupId (same logic as cart-items.tsx)
	const groupMap = new Map<string, GroupedCartItem>();
	const processedItems = new Set<string>();

	if (!isEmpty) {
		data.items.forEach((item: CartItemData) => {
			// Skip if already processed
			if (processedItems.has(item.id)) return;

			// If this is a parent product (glasses) with a groupId
			if (!item.parentProductId && item.groupId) {
				const lensOptions = data.items.filter(
					(otherItem: CartItemData) =>
						otherItem.groupId === item.groupId && otherItem.parentProductId,
				);

				// Mark all items in this group as processed
				lensOptions.forEach((lensOption) => {
					processedItems.add(lensOption.id);
				});

				// Check if this group already exists (for quantity aggregation)
				if (groupMap.has(item.groupId)) {
					// Add to existing group
					const existing = groupMap.get(item.groupId);
					if (existing) {
						existing.totalQuantity += item.quantity;
					}
				} else {
					// Create new group
					groupMap.set(item.groupId, {
						glasses: item,
						lensOptions,
						totalQuantity: item.quantity,
						combinationKey: item.groupId,
					});
				}

				processedItems.add(item.id);
			}
			// Handle glasses without groupId (legacy data or orphaned items)
			else if (!item.parentProductId && !item.groupId) {
				const lensOptions = data.items.filter(
					(otherItem: CartItemData) =>
						otherItem.parentProductId === item.product.id && !otherItem.groupId,
				);

				// Mark lens options as processed
				lensOptions.forEach((lensOption) => {
					processedItems.add(lensOption.id);
				});

				const legacyKey = `legacy:${item.id}`;
				groupMap.set(legacyKey, {
					glasses: item,
					lensOptions,
					totalQuantity: item.quantity,
					combinationKey: legacyKey,
				});

				processedItems.add(item.id);
			}
		});

		// Handle any remaining orphaned lens options
		data.items.forEach((item: CartItemData) => {
			if (!processedItems.has(item.id) && item.parentProductId) {
				const orphanKey = `orphan:${item.id}`;
				groupMap.set(orphanKey, {
					glasses: item,
					lensOptions: [],
					totalQuantity: item.quantity,
					combinationKey: orphanKey,
				});
			}
		});
	}

	const groupedItems = Array.from(groupMap.values());

	// Calculate subtotal from grouped items
	const subtotalInCents = isEmpty
		? 0
		: groupedItems.reduce((total, groupedItem) => {
				return total + calculateGroupTotal(groupedItem);
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

				<Button
					variant="outline"
					className="w-full"
					onClick={handleContinueShopping}
					type="button"
				>
					Continuar Comprando
				</Button>
			</div>
		</TooltipProvider>
	);
}
