"use client";

import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";

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
	const addItem = useCartStore((state) => state.addItem);

	const handleClick = () => {
		addItem({
			productId: id,
			quantity: 1,
		});
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleClick();
		}
	};

	return (
		<div
			className={`${className} cursor-pointer transition-transform duration-200 hover:scale-[1.02]`}
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
