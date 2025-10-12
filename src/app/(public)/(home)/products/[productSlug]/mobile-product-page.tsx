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

interface MobileProductPageProps {
	productSlug: string;
	accordionItems: Array<{
		id: string;
		title: string;
		content: string;
	}>;
}

export function MobileProductPage({
	productSlug,
	accordionItems,
}: MobileProductPageProps) {
	const { data: product } = useSuspenseQuery(
		getProductBySlugQueryOptions(productSlug),
	);

	return (
		<div className="lg:hidden flex flex-col gap-6">
			{/* Mobile: Product Name and Price */}
			<Suspense fallback={<ProductInfoSkeleton />}>
				<ProductInfo productSlug={productSlug} />
			</Suspense>

			{/* Mobile: Product Images Carousel */}
			<Carousel className="w-full">
				<CarouselContent>
					{product.images.length > 0 ? (
						product.images.map((image, index) => (
							<CarouselItem key={image.id}>
								<div className="relative w-full h-80 overflow-hidden">
									<Image
										src={image.imageUrl}
										alt={`${product.name} - Image ${index + 1}`}
										fill
										sizes="100vw"
										className="object-cover rounded"
										quality={75}
									/>
								</div>
							</CarouselItem>
						))
					) : (
						<CarouselItem>
							<div className="relative w-full h-80 overflow-hidden bg-muted rounded flex items-center justify-center">
								<p className="text-muted-foreground">No images available</p>
							</div>
						</CarouselItem>
					)}
				</CarouselContent>
				<CarouselPrevious className="hidden" />
				<CarouselNext className="hidden" />
			</Carousel>

			{/* Mobile: Color Variant Picker */}
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

			{/* Mobile: User Actions */}
			<div className="flex flex-col gap-2">
				<LensSelectionDrawer
					glassesProduct={{
						id: product.id,
						name: product.name,
						slug: product.slug || "",
					}}
					trigger={
						<Button size="lg" className="w-full" variant="default">
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

			{/* Mobile: Product FAQ */}
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

			{/* Mobile: Product Description */}
			<p className="text-md text-foreground text-pretty">
				{product.description}
			</p>

			{/* Mobile: Second Carousel */}
			<Carousel className="w-full">
				<CarouselContent>
					{product.images.length > 0 ? (
						product.images.map((image, index) => (
							<CarouselItem key={`second-${image.id}`}>
								<div className="relative w-full h-80 overflow-hidden">
									<Image
										src={image.imageUrl}
										alt={`${product.name} - Image ${index + 1}`}
										fill
										sizes="100vw"
										className="object-cover rounded"
										quality={75}
									/>
								</div>
							</CarouselItem>
						))
					) : (
						<CarouselItem>
							<div className="relative w-full h-80 overflow-hidden bg-muted rounded flex items-center justify-center">
								<p className="text-muted-foreground">No images available</p>
							</div>
						</CarouselItem>
					)}
				</CarouselContent>
				<CarouselPrevious className="hidden" />
				<CarouselNext className="hidden" />
			</Carousel>
		</div>
	);
}
