"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import {
	type Collection,
	type CollectionProduct,
	useCollections,
} from "@/http";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";

interface LensSelectionDrawerProps {
	trigger: React.ReactNode;
	glassesProduct?: {
		id: string;
		name: string;
		slug: string;
	};
	onLensSelect?: (
		lensId: string,
		prescriptionId?: string,
		finishId?: string,
	) => void;
}

type DrawerStep = 0 | 1 | 2; // Step indices for collections array

export function LensSelectionDrawer({
	trigger,
	glassesProduct,
	onLensSelect,
}: LensSelectionDrawerProps) {
	const router = useRouter();
	const { data: collections, isLoading, error } = useCollections();
	const { addGlassesWithLenses } = useCart();

	const [open, setOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState<DrawerStep>(0);
	const [selectedProducts, setSelectedProducts] = useState<CollectionProduct[]>(
		[],
	);

	// Get collections by slug for consistent ordering
	const lensTypeCollection = collections?.find(
		(c) => c.slug === "tipo-de-lente",
	);
	const prescriptionCollection = collections?.find(
		(c) => c.slug === "grau-das-lentes",
	);
	const finishingCollection = collections?.find(
		(c) => c.slug === "acabamento-das-lentes",
	);

	const orderedCollections = [
		lensTypeCollection,
		prescriptionCollection,
		finishingCollection,
	].filter(Boolean) as Collection[];

	const handleProductSelect = async (product: CollectionProduct) => {
		const newSelectedProducts = [...selectedProducts];
		newSelectedProducts[currentStep] = product;
		setSelectedProducts(newSelectedProducts);

		// Check if we need to go to next step
		if (currentStep < orderedCollections.length - 1) {
			// For lens type selection, check if we need prescription step
			if (currentStep === 0 && product.slug === "com-grau") {
				setCurrentStep(1); // Go to prescription selection
			} else if (
				currentStep === 0 &&
				(product.slug === "sem-grau-com-filtro-de-luz-azul" ||
					product.slug === "sem-grau-apenas-armacao")
			) {
				setCurrentStep(2); // Skip prescription, go to finishing
			} else {
				setCurrentStep((currentStep + 1) as DrawerStep);
			}
		} else {
			// Final step completed - log selection and add to cart
			const finalSelection = [...newSelectedProducts];

			console.log("=== LENS SELECTION COMPLETED ===");
			console.log("Glasses Product:", glassesProduct);
			console.log("Selected Lens Options:");
			finalSelection.forEach((selectedProduct, index) => {
				if (selectedProduct) {
					console.log(
						`  Step ${index + 1} (${orderedCollections[index]?.name}):`,
						{
							id: selectedProduct.id,
							name: selectedProduct.name,
							slug: selectedProduct.slug,
							price: selectedProduct.priceInCents,
							description: selectedProduct.description,
						},
					);
				}
			});
			console.log(
				"Total Additional Cost:",
				finalSelection.reduce((total, p) => total + (p?.priceInCents || 0), 0),
				"cents",
			);
			console.log("================================");

			// Add glasses with lenses to cart
			if (glassesProduct) {
				try {
					const lensProductIds = finalSelection
						.filter(Boolean)
						.map((product) => product.id);

					const result = await addGlassesWithLenses({
						glassesProductId: glassesProduct.id,
						lensProductIds,
						quantity: 1,
					});

					console.log("✅ Successfully added glasses with lenses to cart!");

					// Redirect to cart page
					router.push(`/cart/${result.cartId}`);
				} catch (error) {
					console.error("❌ Failed to add glasses with lenses to cart:", error);
					// You might want to show a toast notification here
				}
			}

			onLensSelect?.(
				finalSelection[0]?.id || "",
				finalSelection[1]?.id,
				finalSelection[2]?.id,
			);
			setOpen(false);
			resetDrawer();
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			// For step 2 (prescription), check if we came from step 0 (lens type)
			if (currentStep === 2 && selectedProducts[0]?.slug !== "com-grau") {
				setCurrentStep(0); // Go back to lens type if we skipped prescription
			} else {
				setCurrentStep((currentStep - 1) as DrawerStep);
			}

			// Clear the selection for the step we're going back from
			const newSelectedProducts = [...selectedProducts];
			newSelectedProducts[currentStep] = undefined as any;
			setSelectedProducts(newSelectedProducts);
		}
	};

	const resetDrawer = () => {
		setTimeout(() => {
			setCurrentStep(0);
			setSelectedProducts([]);
		}, 300); // Wait for drawer close animation
	};

	const getCurrentCollection = () => {
		return orderedCollections[currentStep];
	};

	const getProgressPercentage = () => {
		if (!orderedCollections.length) return 0;

		// Determine total steps based on selection
		let totalSteps = orderedCollections.length;

		// If no lens type selected yet, assume max steps
		if (!selectedProducts[0]) {
			totalSteps = 3;
		} else if (selectedProducts[0]?.slug !== "com-grau") {
			// If not "com-grau", we skip prescription step
			totalSteps = 2;
		}

		const currentStepNumber = currentStep + 1;
		return (currentStepNumber / totalSteps) * 100;
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) {
					resetDrawer();
				}
			}}
		>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetPrimitive.Portal>
				<SheetPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
				<SheetPrimitive.Content
					className={cn(
						"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
						"data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full border-l",
						"w-full sm:max-w-3xl overflow-y-auto p-0",
					)}
				>
					{/* Hidden title for accessibility */}
					<SheetPrimitive.Title className="sr-only">
						{getCurrentCollection()?.name || "Lens Selection"}
					</SheetPrimitive.Title>
					<div className="p-6">
						{/* Loading State */}
						{isLoading && (
							<div className="flex items-center justify-center py-8">
								<div className="text-sm text-muted-foreground">
									Loading lens options...
								</div>
							</div>
						)}

						{/* Error State */}
						{error && (
							<div className="flex items-center justify-center py-8">
								<div className="text-sm text-destructive">
									Failed to load lens options. Please try again.
								</div>
							</div>
						)}

						{/* Content */}
						{!isLoading && !error && orderedCollections.length > 0 && (
							<>
								{/* Progress Bar */}
								<div className="w-full bg-muted h-1 mb-4">
									<div
										className="bg-primary h-1 transition-all duration-300"
										style={{
											width: `${getProgressPercentage()}%`,
										}}
									/>
								</div>

								{/* Header */}
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center gap-3">
										{currentStep > 0 ? (
											<Button
												variant="ghost"
												size="sm"
												onClick={handleBack}
												className="p-2"
											>
												<ArrowLeft className="h-4 w-4" />
											</Button>
										) : (
											<div className="w-10 h-10" /> // Placeholder to maintain alignment
										)}
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setOpen(false)}
										className="p-2"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>

								{/* Content */}
								<div className="space-y-6">
									<div>
										<h2 className="text-xl font-semibold text-foreground mb-2">
											{getCurrentCollection()?.name}
										</h2>
										<p className="text-sm text-muted-foreground">
											{getCurrentCollection()?.description}
										</p>
									</div>

									{/* Dynamic Product Options */}
									<div className="space-y-3">
										{getCurrentCollection()?.products.map((product, index) => (
											<div key={product.id} className="space-y-2">
												<div
													className="border border-border rounded-md p-4 hover:border-primary/50 transition-all duration-200 cursor-pointer group hover:shadow-sm"
													onClick={() => handleProductSelect(product)}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault();
															handleProductSelect(product);
														}
													}}
													role="button"
													tabIndex={0}
												>
													<div className="space-y-3">
														<div className="flex items-center justify-between">
															<div className="inline-block">
																<span className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-full">
																	{product.name}
																</span>
															</div>
															{product.priceInCents > 0 && (
																<div className="text-right">
																	<span className="text-sm font-medium text-foreground">
																		+{formatPrice(product.priceInCents)}
																	</span>
																</div>
															)}
															{product.priceInCents === 0 && (
																<div className="text-right">
																	<span className="text-sm font-medium text-muted-foreground">
																		grátis
																	</span>
																</div>
															)}
														</div>
														<p className="text-sm text-muted-foreground leading-relaxed">
															{product.description}
														</p>
													</div>
												</div>
												{index <
													(getCurrentCollection()?.products.length || 0) -
														1 && <hr className="border-border/30" />}
											</div>
										))}
									</div>
								</div>
							</>
						)}
					</div>
				</SheetPrimitive.Content>
			</SheetPrimitive.Portal>
		</Sheet>
	);
}
