"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { CartProduct } from "@/components/ui/cart-product";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	useRemoveProductFromCart,
	useUpdateCartProductQuantity,
} from "@/http/cart/mutations";
import type { GetCartResponse } from "@/http/types";
import { calculateDiscountedPrice, formatPrice } from "@/lib/format-price";

import { getCartQueryOptions } from "./get-cart-query-options";

type CartItemData = GetCartResponse["items"][0];

interface GroupedCartItem {
	glasses: CartItemData;
	lensOptions: CartItemData[];
	totalQuantity: number;
	combinationKey: string;
}

function LensOption({ item }: { item: CartItemData }) {
	// Calculate lens option price
	const lensPrice = calculateDiscountedPrice(
		item.productPrice.priceInCents,
		item.productPrice.discountPercentage,
	);

	return (
		<li className="flex items-center gap-2 text-sm text-muted-foreground ml-4 mt-1">
			<span>{item.product.name}</span>
			{lensPrice > 0 && <span>({formatPrice(lensPrice)})</span>}
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Info className="h-3 w-3 cursor-help" />
					</TooltipTrigger>
					<TooltipContent>
						<p className="max-w-xs">{item.product.description} </p>
						{lensPrice > 0 && (
							<strong className="block mt-2 text-foreground font-bold">
								Custo adicional: {formatPrice(lensPrice)}
							</strong>
						)}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</li>
	);
}

function CartItem({
	groupedItem,
	cartId,
}: {
	groupedItem: GroupedCartItem;
	cartId: string;
}) {
	const item = groupedItem.glasses; // Use the glasses item for main display
	const product = item.product;
	const productPrice = item.productPrice;
	const quantity = groupedItem.totalQuantity; // Use the combined quantity

	const removeProductMutation = useRemoveProductFromCart();
	const updateQuantityMutation = useUpdateCartProductQuantity();

	// Get the first product image or use a placeholder
	const imageUrl =
		product.images?.[0]?.imageUrl ||
		"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg";

	// Calculate total price including lens options
	const lensOptionsPrice = groupedItem.lensOptions.reduce(
		(total, lensOption) => {
			const lensDiscountedPrice = calculateDiscountedPrice(
				lensOption.productPrice.priceInCents,
				lensOption.productPrice.discountPercentage,
			);
			return total + lensDiscountedPrice;
		},
		0,
	);

	// Calculate glasses price considering discount
	const glassesDiscountedPrice = calculateDiscountedPrice(
		productPrice.priceInCents,
		productPrice.discountPercentage,
	);

	// Total price per unit (glasses + all lens options)
	const totalPricePerUnit = glassesDiscountedPrice + lensOptionsPrice;

	// For display compatibility, use the total price
	const discountedPrice = totalPricePerUnit;

	const handleRemoveProduct = () => {
		removeProductMutation.mutate(
			{
				cartId,
				productId: product.id,
			},
			{
				onSuccess: () => {
					// If this was the last item in cart, clear the cart store
					// The query will be invalidated and refetched by the mutation
				},
			},
		);
	};

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity <= 0) {
			handleRemoveProduct();
			return;
		}

		updateQuantityMutation.mutate({
			cartId,
			productId: product.id,
			quantity: newQuantity,
		});
	};

	const handleIncrement = () => {
		handleQuantityChange(quantity + 1);
	};

	const handleDecrement = () => {
		handleQuantityChange(quantity - 1);
	};

	const isLoading =
		updateQuantityMutation.isPending || removeProductMutation.isPending;

	return (
		<CartProduct productId={product.id} imageSize="md">
			<CartProduct.Image
				imageUrl={imageUrl}
				alt={product.name}
				href={`/products/${product.slug}`}
			/>

			<CartProduct.Content>
				<CartProduct.Header>
					<CartProduct.Name name={product.name} />
					{product.description && (
						<CartProduct.Description description={product.description} />
					)}

					{/* Display lens options */}
					{groupedItem.lensOptions.length > 0 && (
						<ul className="mt-2">
							<div className="text-base font-bold text-foreground mb-1">
								Lentes
							</div>
							{groupedItem.lensOptions.map((lensOption) => (
								<LensOption key={lensOption.id} item={lensOption} />
							))}
						</ul>
					)}

					<CartProduct.Price
						priceInCents={discountedPrice}
						originalPriceInCents={productPrice.priceInCents}
						discountPercentage={productPrice.discountPercentage}
					/>
				</CartProduct.Header>

				{/* Mobile Actions */}
				<CartProduct.Actions mobileLayout>
					<CartProduct.QuantityControls
						quantity={quantity}
						maxQuantity={product.stock}
						onIncrement={handleIncrement}
						onDecrement={handleDecrement}
						disabled={isLoading}
					/>
					<CartProduct.Delete
						onDelete={handleRemoveProduct}
						disabled={isLoading}
						mobileLayout
					/>
				</CartProduct.Actions>

				<CartProduct.Stock stock={product.stock} />
			</CartProduct.Content>

			{/* Desktop Actions */}
			<CartProduct.Actions>
				<CartProduct.QuantityControls
					quantity={quantity}
					maxQuantity={product.stock}
					onIncrement={handleIncrement}
					onDecrement={handleDecrement}
					disabled={isLoading}
				/>
			</CartProduct.Actions>

			<CartProduct.Delete onDelete={handleRemoveProduct} disabled={isLoading} />
		</CartProduct>
	);
}

export function CartItems({ cartId }: { cartId: string }) {
	const { data } = useSuspenseQuery(getCartQueryOptions(cartId));

	if (!data.items || data.items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<p className="text-lg text-muted-foreground">Seu carrinho está vazio</p>
				<p className="text-sm text-muted-foreground mt-2">
					Adicione produtos para continuar
				</p>
			</div>
		);
	}

	// Group items by groupId (glasses + lens combinations)
	const groupMap = new Map<string, GroupedCartItem>();
	const processedItems = new Set<string>();

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

	const groupedItems = Array.from(groupMap.values());

	return (
		<ul className="flex flex-col gap-4">
			{groupedItems.map((groupedItem, index) => (
				<div key={groupedItem.combinationKey}>
					<CartItem groupedItem={groupedItem} cartId={cartId} />
					{index < groupedItems.length - 1 && <Separator className="my-6" />}
				</div>
			))}
		</ul>
	);
}
