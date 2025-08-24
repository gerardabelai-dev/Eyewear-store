"use client";

import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";

interface ProductItemProps {
	id: string;
	name: string;
	price?: string;
	image: string;
	alt?: string;
	showPrice?: boolean;
	className?: string;
	imageClassName?: string;
	contentClassName?: string;
}

export function ProductItem({
	id,
	name,
	price,
	image,
	alt,
	showPrice = true,
	className = "flex flex-col items-center gap-2",
	imageClassName = "relative h-48 md:h-32 w-full aspect-video",
	contentClassName,
}: ProductItemProps) {
	const { addItem, isCreatingCart, isAddingProduct } = useCart();

	const handleClick = async () => {
		try {
			const result = await addItem({
				productId: id,
				quantity: 1,
			});

			// Show toast with clickable link to cart using the actual cart ID
			toast.success(
				<p className="flex items-center whitespace-nowrap">
					{name.split(" ")[0]}&nbsp;adicionado&nbsp;ao&nbsp;
					<Link
						href={`/cart/${result.cartId}`}
						className="flex items-center gap-2 text-primary-foreground whitespace-nowrap font-bold underline underline-offset-4 hover:opacity-70"
						onClick={() => toast.dismiss()}
					>
						<span>carrinho</span>
						<ExternalLinkIcon className="size-4" />
					</Link>
				</p>,
			);
		} catch (error) {
			console.error("Failed to add item to cart:", error);
			toast.error("Erro ao adicionar produto ao carrinho");
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleClick();
		}
	};

	const isLoading = isCreatingCart || isAddingProduct;

	return (
		<div
			className={`${className} cursor-pointer transition-transform duration-200 hover:scale-[1.02] ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
		>
			<div className={imageClassName}>
				<Image
					src={image}
					alt={alt || name}
					className="object-cover rounded transition-transform duration-300 hover:scale-105"
					quality={75}
					fill
				/>
			</div>
			<div className={contentClassName}>
				{showPrice && price ? (
					<div className="flex gap-2">
						<strong>{name}</strong>
						<span>{price}</span>
					</div>
				) : (
					<h3>{name}</h3>
				)}
			</div>
		</div>
	);
}
