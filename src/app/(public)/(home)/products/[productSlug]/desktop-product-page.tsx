"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Suspense } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { getProductBySlugQueryOptions } from "@/http/products/queries";
import { ColorVariantPicker } from "./color-variant-picker";
import { LensSelectionDrawer } from "./lens-selection-drawer";
import { ProductInfo } from "./product-info";
import { ProductInfoSkeleton } from "./product-info-skeleton";

interface DesktopProductPageProps {
	productSlug: string;
	accordionItems: Array<{
		id: string;
		title: string;
		content: string;
	}>;
}

export function DesktopProductPage({
	productSlug,
	accordionItems,
}: DesktopProductPageProps) {
	const { data: product } = useSuspenseQuery(
		getProductBySlugQueryOptions(productSlug),
	);

	// Get the default image (first one) and other images
	const defaultImage = product.images[0];
	const otherImages = product.images.slice(1);

	return (
		<section className="hidden lg:grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-4">
			{/* Product Images Left Scrollable Column */}
			<div className="flex flex-col gap-4">
				{/* Grid of smaller images */}
				{otherImages.length > 0 && (
					<div className="grid grid-cols-2 gap-4">
						{otherImages.slice(0, 4).map((image, index) => (
							<div
								key={image.id}
								className="relative w-full h-96 overflow-hidden"
							>
								<Image
									src={image.imageUrl}
									alt={`${product.name} - Image ${index + 2}`}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
									className="object-cover rounded"
									quality={75}
								/>
							</div>
						))}
						{/* Fill remaining slots with placeholder if needed */}
						{Array.from({ length: Math.max(0, 4 - otherImages.length) }).map(
							(_, index) => (
								<div
									key={`placeholder-${index}`}
									className="relative w-full h-96 overflow-hidden bg-transparent rounded"
								/>
							),
						)}
					</div>
				)}

				{/* Big default image */}
				<div className="relative w-full h-[900px] overflow-hidden">
					{defaultImage ? (
						<Image
							src={defaultImage.imageUrl}
							alt={`${product.name} - Main Image`}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
							className="object-cover rounded"
							quality={75}
						/>
					) : (
						<div className="w-full h-full bg-muted rounded flex items-center justify-center">
							<p className="text-muted-foreground">No images available</p>
						</div>
					)}
				</div>
				<p className="text-md text-foreground text-pretty">
					{product.description}
				</p>

				<Carousel className="w-full">
					<CarouselContent className="-ml-4">
						{product.images.length > 0 ? (
							product.images.map((image, index) => (
								<CarouselItem key={image.id} className="pl-4 basis-1/3">
									<div className="relative w-full h-80 overflow-hidden">
										<Image
											src={image.imageUrl}
											alt={`${product.name} - Image ${index + 1}`}
											fill
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											className="object-cover rounded"
											quality={75}
										/>
									</div>
								</CarouselItem>
							))
						) : (
							<CarouselItem className="pl-4 basis-1/3">
								<div className="relative w-full h-80 overflow-hidden bg-muted rounded flex items-center justify-center">
									<p className="text-muted-foreground">No images available</p>
								</div>
							</CarouselItem>
						)}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>

				{/* Product FAQ */}
				<div className="flex flex-col gap-2">
					<Accordion type="single" collapsible className="w-full">
						{accordionItems.map((item) => (
							<AccordionItem value={item.id} key={item.id} className="py-2">
								<AccordionPrimitive.Header className="flex">
									<AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
										{item.title}
										<PlusIcon
											size={16}
											className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
											aria-hidden="true"
										/>
									</AccordionPrimitive.Trigger>
								</AccordionPrimitive.Header>
								<AccordionContent className="text-muted-foreground pb-2">
									{item.content}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>

			{/* Product Info Sticky Right Column */}
			<div className="flex flex-col gap-4 bg-muted p-8 rounded h-fit sticky top-14">
				<Suspense fallback={<ProductInfoSkeleton />}>
					<ProductInfo productSlug={productSlug} />
				</Suspense>

				{/* Color Variant Picker */}
				<div className="flex flex-col gap-2">
					<Label htmlFor="color-variant-select">Cores da Armação</Label>

					<fieldset aria-label="Escolha uma cor" className="mt-2">
						<div className="flex items-center gap-x-3">
							<ColorVariantPicker
								label="Vermelho"
								value="red"
								colorVariant="black-rose-300"
							/>
							<ColorVariantPicker
								label="Azul"
								value="blue"
								colorVariant="black-blue-300"
							/>
							<ColorVariantPicker
								label="Verde"
								value="green"
								colorVariant="black-green-300"
							/>
						</div>
					</fieldset>
				</div>

				{/* User Actions */}
				<div className="flex flex-col gap-2">
					<LensSelectionDrawer
						trigger={
							<Button size="lg" className="w-full" variant="vibrant">
								Escolher lentes e comprar
							</Button>
						}
						onLensSelect={(lensId, prescriptionId, finishId) => {
							console.log(
								"Selected lens:",
								lensId,
								"Prescription:",
								prescriptionId,
								"Finish:",
								finishId,
							);
							// TODO: Handle lens selection logic
						}}
					/>
				</div>
			</div>
		</section>
	);
}
