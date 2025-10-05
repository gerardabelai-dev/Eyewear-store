"use client";

import { Check, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";

// Context for sharing data between components
interface CartProductContextValue {
	productId?: string;
	imageSize?: "sm" | "md" | "lg";
	layout?: "horizontal" | "vertical";
}

const CartProductContext = createContext<CartProductContextValue>({});

// Main container component
interface CartProductProps {
	children: React.ReactNode;
	className?: string;
	productId?: string;
	imageSize?: "sm" | "md" | "lg";
	layout?: "horizontal" | "vertical";
}

export function CartProduct({
	children,
	className,
	productId,
	imageSize = "md",
	layout = "horizontal",
}: CartProductProps) {
	const contextValue = { productId, imageSize, layout };

	return (
		<CartProductContext.Provider value={contextValue}>
			<li
				className={cn(
					"flex",
					layout === "horizontal" ? "gap-4" : "flex-col gap-2",
					className,
				)}
			>
				{children}
			</li>
		</CartProductContext.Provider>
	);
}

// Image container component
interface CartProductImageProps {
	imageUrl: string;
	alt: string;
	href?: string;
	className?: string;
	fallback?: React.ReactNode;
}

export function CartProductImage({
	imageUrl,
	alt,
	href,
	className,
	fallback,
}: CartProductImageProps) {
	const { imageSize } = useContext(CartProductContext);

	const sizeClasses = {
		sm: "w-32 min-w-32 md:w-48 md:min-w-48",
		md: "w-48 min-w-48 md:w-72 md:min-w-72",
		lg: "w-48 min-w-48 md:w-96 md:min-w-96",
	};

	const imageElement = imageUrl ? (
		<Image
			src={imageUrl}
			alt={alt}
			className="object-cover rounded"
			quality={75}
			fill
			sizes="(max-width: 768px) 192px, 288px"
		/>
	) : (
		fallback || (
			<div className="w-full h-full bg-muted rounded flex items-center justify-center">
				<span className="text-muted-foreground text-sm">Sem imagem</span>
			</div>
		)
	);

	const containerClasses = cn(
		"relative h-full aspect-video",
		sizeClasses[imageSize || "md"],
		className,
	);

	if (href) {
		return (
			<Link href={href} className={containerClasses}>
				{imageElement}
			</Link>
		);
	}

	return <div className={containerClasses}>{imageElement}</div>;
}

// Content container component
interface CartProductContentProps {
	children: React.ReactNode;
	className?: string;
}

export function CartProductContent({
	children,
	className,
}: CartProductContentProps) {
	return (
		<div className={cn("flex flex-col justify-between gap-2", className)}>
			{children}
		</div>
	);
}

// Header section (name, description, price)
interface CartProductHeaderProps {
	children: React.ReactNode;
	className?: string;
}

export function CartProductHeader({
	children,
	className,
}: CartProductHeaderProps) {
	return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}

// Product name component
interface CartProductNameProps {
	name: string;
	className?: string;
}

export function CartProductName({ name, className }: CartProductNameProps) {
	return <h2 className={cn("text-lg font-bold", className)}>{name}</h2>;
}

// Product description component
interface CartProductDescriptionProps {
	description: string;
	className?: string;
}

// TODO: make this not show complete description if too long, allow user to toggle "Ver mais..."
export function CartProductDescription({
	description,
	className,
}: CartProductDescriptionProps) {
	return (
		<span className={cn("text-sm text-muted-foreground", className)}>
			{description}
		</span>
	);
}

// Product price component
interface CartProductPriceProps {
	priceInCents: number;
	originalPriceInCents?: number;
	discountPercentage?: number;
	className?: string;
}

export function CartProductPrice({
	priceInCents,
	originalPriceInCents,
	discountPercentage,
	className,
}: CartProductPriceProps) {
	const hasDiscount = discountPercentage && discountPercentage > 0;

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{hasDiscount && originalPriceInCents ? (
				<>
					<strong className="text-md">{formatPrice(priceInCents)}</strong>
					<span className="text-sm text-muted-foreground line-through">
						{formatPrice(originalPriceInCents)}
					</span>
				</>
			) : (
				<strong className="text-md">{formatPrice(priceInCents)}</strong>
			)}
		</div>
	);
}

// Stock status component
interface CartProductStockProps {
	stock: number;
	className?: string;
}

export function CartProductStock({ stock, className }: CartProductStockProps) {
	const inStock = stock > 0;

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Check className="size-4 text-emerald-500" />
			<span className="text-sm text-muted-foreground">
				{inStock ? "Em estoque" : "Fora de estoque"}
			</span>
		</div>
	);
}

// Quantity display component (read-only)
interface CartProductQuantityDisplayProps {
	quantity: number;
	unitPrice?: number;
	className?: string;
}

export function CartProductQuantityDisplay({
	quantity,
	unitPrice,
	className,
}: CartProductQuantityDisplayProps) {
	return (
		<div
			className={cn(
				"flex flex-col md:flex-row md:items-center gap-2",
				className,
			)}
		>
			<span className="text-sm text-muted-foreground">
				Quantidade: {quantity}
			</span>
			{unitPrice && (
				<>
					<div className="hidden md:block w-px h-4 bg-border" />
					<span className="text-sm text-muted-foreground">
						Preço: {formatPrice(unitPrice)}
					</span>
				</>
			)}
		</div>
	);
}

// Quantity controls component
interface CartProductQuantityControlsProps {
	quantity: number;
	maxQuantity?: number;
	onIncrement: () => void;
	onDecrement: () => void;
	disabled?: boolean;
	className?: string;
}

export function CartProductQuantityControls({
	quantity,
	maxQuantity,
	onIncrement,
	onDecrement,
	disabled = false,
	className,
}: CartProductQuantityControlsProps) {
	return (
		<div className={cn("flex items-center gap-2 border rounded-md", className)}>
			<Button
				variant="ghost"
				size="icon"
				onClick={onDecrement}
				disabled={disabled}
				className="h-8 w-8 p-0"
			>
				<Minus className="size-3" />
			</Button>
			<span className="text-sm font-mono w-8 text-center">{quantity}</span>
			<Button
				variant="ghost"
				size="icon"
				onClick={onIncrement}
				disabled={
					disabled || (maxQuantity !== undefined && quantity >= maxQuantity)
				}
				className="h-8 w-8 p-0"
			>
				<Plus className="size-3" />
			</Button>
		</div>
	);
}

// Actions section (quantity controls + delete button)
interface CartProductActionsProps {
	children: React.ReactNode;
	className?: string;
	mobileLayout?: boolean;
}

export function CartProductActions({
	children,
	className,
	mobileLayout = false,
}: CartProductActionsProps) {
	if (mobileLayout) {
		return (
			<div className={cn("flex md:hidden gap-2 items-start", className)}>
				{children}
			</div>
		);
	}

	return (
		<div className={cn("ml-auto hidden md:flex items-start gap-2", className)}>
			{children}
		</div>
	);
}

// Delete button component
interface CartProductDeleteProps {
	onDelete: () => void;
	disabled?: boolean;
	className?: string;
	mobileLayout?: boolean;
}

export function CartProductDelete({
	onDelete,
	disabled = false,
	className,
	mobileLayout = false,
}: CartProductDeleteProps) {
	const baseClasses = "flex items-center justify-center p-0";
	const responsiveClasses = mobileLayout ? "flex md:hidden" : "hidden md:flex";

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={onDelete}
			disabled={disabled}
			className={cn(baseClasses, responsiveClasses, className)}
		>
			<Trash2 className="size-4" />
		</Button>
	);
}

// Export all components
CartProduct.Image = CartProductImage;
CartProduct.Content = CartProductContent;
CartProduct.Header = CartProductHeader;
CartProduct.Name = CartProductName;
CartProduct.Description = CartProductDescription;
CartProduct.Price = CartProductPrice;
CartProduct.Stock = CartProductStock;
CartProduct.QuantityDisplay = CartProductQuantityDisplay;
CartProduct.QuantityControls = CartProductQuantityControls;
CartProduct.Actions = CartProductActions;
CartProduct.Delete = CartProductDelete;
