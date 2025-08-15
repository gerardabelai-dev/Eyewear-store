"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Product, ProductImage, ProductPrice } from "@/lib/db/schema";
import { getCartQueryOptions } from "./get-cart-query-options";

interface CartItemData {
	id: string;
	cartId: string;
	productId: string;
	productPriceId: string;
	quantity: number;
	createdAt: string;
	updatedAt: string;
	product: Product & {
		images: ProductImage[];
	};
	productPrice: ProductPrice;
}

function formatPrice(priceInCents: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(priceInCents / 100);
}

function CartItem({ item }: { item: CartItemData }) {
	const product = item.product;
	const productPrice = item.productPrice;
	const quantity = item.quantity;

	// Get the first product image or use a placeholder
	const imageUrl =
		product.images?.[0]?.imageUrl ||
		"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg";

	// Calculate actual price considering discount
	const discountedPrice =
		productPrice.priceInCents * (1 - productPrice.discountPercentage / 100);

	return (
		<li className="flex gap-4">
			<Link
				href={`/products/${product.id}`}
				className="relative w-48 md:w-96 h-full aspect-video"
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

				<div className="flex md:hidden gap-2">
					<Select defaultValue={quantity.toString()}>
						<SelectTrigger id={`quantity-${item.id}`}>
							<SelectValue placeholder="Selecione a quantidade" />
						</SelectTrigger>
						<SelectContent>
							{[1, 2, 3, 4, 5].map((num) => (
								<SelectItem key={num} value={num.toString()}>
									{num}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button variant="ghost" size="icon">
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

			<div className="*:not-first:mt-2 ml-auto hidden md:block">
				<Select defaultValue={quantity.toString()}>
					<SelectTrigger id={`quantity-desktop-${item.id}`}>
						<SelectValue placeholder="Selecione a quantidade" />
					</SelectTrigger>
					<SelectContent>
						{[1, 2, 3, 4, 5].map((num) => (
							<SelectItem key={num} value={num.toString()}>
								{num}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Button variant="ghost" size="icon" className="hidden md:block">
				<Trash2 className="size-4" />
			</Button>
		</li>
	);
}

export function CartItems() {
	const { data } = useSuspenseQuery(getCartQueryOptions);

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
					<CartItem item={item} />
					{index < data.items.length - 1 && <Separator className="my-6" />}
				</div>
			))}
		</ul>
	);
}
