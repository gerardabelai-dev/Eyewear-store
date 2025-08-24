"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	useRemoveProductFromCart,
	useUpdateCartProductQuantity,
} from "@/http/cart/mutations";
import type { GetCartResponse } from "@/http/types";
import { calculateDiscountedPrice, formatPrice } from "@/lib/format-price";

import { getCartQueryOptions } from "./get-cart-query-options";

type CartItemData = GetCartResponse["items"][0];

function CartItem({ item, cartId }: { item: CartItemData; cartId: string }) {
	const product = item.product;
	const productPrice = item.productPrice;
	const quantity = item.quantity;

	const removeProductMutation = useRemoveProductFromCart();
	const updateQuantityMutation = useUpdateCartProductQuantity();

	// Get the first product image or use a placeholder
	const imageUrl =
		product.images?.[0]?.imageUrl ||
		"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg";

	// Calculate actual price considering discount
	const discountedPrice = calculateDiscountedPrice(
		productPrice.priceInCents,
		productPrice.discountPercentage,
	);

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

	return (
		<li className="flex gap-4">
			<Link
				href={`/products/${product.id}`}
				className="relative w-48 md:min-w-72 h-full aspect-video"
			>
				<Image
					src={imageUrl}
					alt={product.name}
					className="object-cover rounded"
					quality={75}
					fill
				/>
			</Link>

			<div className="flex flex-col justify-between gap-2">
				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-bold">{product.name}</h2>
					{product.description && (
						<span className="text-sm text-muted-foreground">
							{product.description}
						</span>
					)}
					<div className="flex items-center gap-2">
						{productPrice.discountPercentage > 0 ? (
							<>
								<strong className="text-md">
									{formatPrice(discountedPrice)}
								</strong>
								<span className="text-sm text-muted-foreground line-through">
									{formatPrice(productPrice.priceInCents)}
								</span>
							</>
						) : (
							<strong className="text-md">
								{formatPrice(productPrice.priceInCents)}
							</strong>
						)}
					</div>
				</div>

				<div className="flex md:hidden gap-2 items-center">
					<div className="flex items-center gap-2 border rounded-md">
						<Button
							variant="ghost"
							size="icon"
							onClick={handleDecrement}
							disabled={
								updateQuantityMutation.isPending ||
								removeProductMutation.isPending
							}
							className="h-8 w-8 p-0"
						>
							<Minus className="size-3" />
						</Button>
						<span className="text-sm font-mono w-8 text-center">
							{quantity}
						</span>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleIncrement}
							disabled={
								updateQuantityMutation.isPending || quantity >= product.stock
							}
							className="h-8 w-8 p-0"
						>
							<Plus className="size-3" />
						</Button>
					</div>

					<Button
						variant="ghost"
						size="icon"
						onClick={handleRemoveProduct}
						disabled={removeProductMutation.isPending}
						className="flex items-center justify-center p-0"
					>
						<Trash2 className="size-4" />
					</Button>
				</div>

				<div className="flex items-center gap-2">
					<Check className="size-4 text-emerald-500" />
					<span className="text-sm text-muted-foreground">
						{product.stock > 0 ? "Em estoque" : "Fora de estoque"}
					</span>
				</div>
			</div>

			<div className="ml-auto hidden md:flex items-center gap-2">
				<div className="flex items-center gap-2 border rounded-md">
					<Button
						variant="ghost"
						size="icon"
						onClick={handleDecrement}
						disabled={
							updateQuantityMutation.isPending ||
							removeProductMutation.isPending
						}
						className="h-8 w-8 p-0"
					>
						<Minus className="size-3" />
					</Button>
					<span className="text-sm font-mono w-8 text-center">{quantity}</span>
					<Button
						variant="ghost"
						size="icon"
						onClick={handleIncrement}
						disabled={
							updateQuantityMutation.isPending || quantity >= product.stock
						}
						className="h-8 w-8 p-0"
					>
						<Plus className="size-3" />
					</Button>
				</div>
			</div>

			<Button
				variant="ghost"
				size="icon"
				className="hidden md:flex items-center justify-center p-0"
				onClick={handleRemoveProduct}
				disabled={removeProductMutation.isPending}
			>
				<Trash2 className="size-4" />
			</Button>
		</li>
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

	return (
		<ul className="flex flex-col gap-4">
			{data.items.map((item: CartItemData, index: number) => (
				<div key={item.id}>
					<CartItem item={item} cartId={cartId} />
					{index < data.items.length - 1 && <Separator className="my-6" />}
				</div>
			))}
		</ul>
	);
}
