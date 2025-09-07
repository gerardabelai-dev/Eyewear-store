"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";

interface LensOption {
	id: string;
	title: string;
	description: string;
	badge?: string;
}

interface PrescriptionOption {
	id: string;
	title: string;
	description: string;
	price: number;
	isFree?: boolean;
}

interface LensFinishOption {
	id: string;
	title: string;
	description: string;
	price: number;
	isFree?: boolean;
}

const lensOptions: LensOption[] = [
	{
		id: "com-grau",
		title: "Com Grau",
		description:
			"Lentes monofocais para correção de miopia, hipermetropia ou astigmatismo",
		badge: undefined,
	},
	{
		id: "sem-grau-filtro",
		title: "Sem grau | com filtro de luz azul",
		description:
			"Lentes sem grau ideais para quem está à procura de estilo e mais conforto visual. Perfeito para quem não desgruda os olhos das telas",
		badge: undefined,
	},
	{
		id: "sem-grau-armacao",
		title: "Sem grau | apenas a armação",
		description:
			"Armação acompanhada de lentes de demostração feitas de acrílico e não recomendadas para o uso diário",
		badge: undefined,
	},
];

const prescriptionOptions: PrescriptionOption[] = [
	{
		id: "grau-leve",
		title: "Grau leve | até +/- 2,75",
		description:
			"Lentes com espessura padrão, feitas de resina. Contemplam hipermetropia e miopia até +/- 2,75 e astigmatismo até -2,00",
		price: 0,
		isFree: true,
	},
	{
		id: "grau-moderado",
		title: "Grau moderado | até +/- 4,00",
		description:
			"Lentes mais leves e resistentes, feitas de policarbonato. Contemplam hipermetropia e miopia até +/- 4,00 e astigmatismo até -2,00",
		price: 30000, // R$ 300.00 in cents
	},
	{
		id: "grau-alto",
		title: "Grau alto | até +5,00/-6,50",
		description:
			"Lentes mais finas e voltadas para graus mais altos, feitas de resina de alto índice. Contemplam hipermetropia até +5,00, miopia até -6,50, e astigmatismo até -4,00",
		price: 60000, // R$ 600.00 in cents
	},
];

const lensFinishOptions: LensFinishOption[] = [
	{
		id: "classico",
		title: "Clássico",
		description:
			"Lentes com espessura padrão, feitas de resina. Contemplam hipermetropia e miopia até +/- 2,75 e astigmatismo até -2,00",
		price: 0,
		isFree: true,
	},
	{
		id: "filtro-luz-azul",
		title: "Filtro de luz azul",
		description:
			"Além da resistência contra arranhões, antirreflexo e proteção UV, também filtram mais luz azul de aparelhos digitais e do sol do que lentes clássicas ou fotossensíveis. *O filtro de luz azul pode deixar um residual azulado ou esverdeado nas lentes.",
		price: 20000, // R$ 200.00 in cents
	},
];

interface LensSelectionDrawerProps {
	trigger: React.ReactNode;
	onLensSelect?: (
		lensId: string,
		prescriptionId?: string,
		finishId?: string,
	) => void;
}

type DrawerStep =
	| "lens-selection"
	| "prescription-selection"
	| "finish-selection";

export function LensSelectionDrawer({
	trigger,
	onLensSelect,
}: LensSelectionDrawerProps) {
	const [open, setOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState<DrawerStep>("lens-selection");
	const [selectedLens, setSelectedLens] = useState<string | null>(null);
	const [selectedPrescription, setSelectedPrescription] = useState<
		string | null
	>(null);

	const handleLensSelect = (lensId: string) => {
		setSelectedLens(lensId);

		if (lensId === "com-grau") {
			setCurrentStep("prescription-selection");
		} else {
			// For non-prescription lenses, complete the selection
			onLensSelect?.(lensId);
			setOpen(false);
			resetDrawer();
		}
	};

	const handlePrescriptionSelect = (prescriptionId: string) => {
		setSelectedPrescription(prescriptionId);
		setCurrentStep("finish-selection");
	};

	const handleFinishSelect = (finishId: string) => {
		if (selectedLens && selectedPrescription) {
			onLensSelect?.(selectedLens, selectedPrescription, finishId);
			setOpen(false);
			resetDrawer();
		}
	};

	const handleBack = () => {
		if (currentStep === "finish-selection") {
			setCurrentStep("prescription-selection");
			// Keep selectedPrescription
		} else if (currentStep === "prescription-selection") {
			setCurrentStep("lens-selection");
			setSelectedPrescription(null);
		}
	};

	const resetDrawer = () => {
		setTimeout(() => {
			setCurrentStep("lens-selection");
			setSelectedLens(null);
			setSelectedPrescription(null);
		}, 300); // Wait for drawer close animation
	};

	const getStepTitle = () => {
		switch (currentStep) {
			case "lens-selection":
				return "Escolha seu tipo de lente";
			case "prescription-selection":
				return "Selecione as lentes de acordo com seu grau.";
			case "finish-selection":
				return "Selecione o acabamento das suas lentes";
			default:
				return "";
		}
	};

	const getStepDescription = () => {
		switch (currentStep) {
			case "lens-selection":
				return "Selecione a opção que melhor atende às suas necessidades";
			case "prescription-selection":
				return "Assim que finalizar a compra vamos pedir os dados da sua receita. Não se preocupe, também vamos te lembrar via e-mail e sms!";
			case "finish-selection":
				return "";
			default:
				return "";
		}
	};

	const getCurrentStepNumber = () => {
		switch (currentStep) {
			case "lens-selection":
				return 1;
			case "prescription-selection":
				return 2;
			case "finish-selection":
				return 3;
			default:
				return 1;
		}
	};

	const getTotalSteps = () => {
		// Always show progress for potential steps when on first step
		// This prevents showing 100% on first step when "Com Grau" might be selected
		if (currentStep === "lens-selection" && !selectedLens) {
			// Show progress for potential 3 steps until user makes a choice
			return 3;
		}

		// If we're on finish selection step, we know there are 3 steps
		if (currentStep === "finish-selection") return 3;
		// If we're on prescription selection step, we know there are at least 2 steps, but will be 3
		if (currentStep === "prescription-selection") return 3;
		// If "Com Grau" is selected, there will be 3 steps
		if (selectedLens === "com-grau") return 3;
		// Otherwise, just 1 step (for non-prescription lenses)
		return 1;
	};

	const getProgressPercentage = () => {
		const current = getCurrentStepNumber();
		const total = getTotalSteps();

		// For 3 steps: 1/3 = 33.33%, 2/3 = 66.66%, 3/3 = 100%
		// For 1 step: 1/1 = 100%
		return (current / total) * 100;
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
						{getStepTitle()}
					</SheetPrimitive.Title>
					<div className="p-6">
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
								{currentStep !== "lens-selection" ? (
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
									{getStepTitle()}
								</h2>
								<p className="text-sm text-muted-foreground">
									{getStepDescription()}
								</p>
							</div>

							{currentStep === "lens-selection" && (
								<div className="space-y-3">
									{lensOptions.map((option, index) => (
										<div key={option.id} className="space-y-2">
											<div
												className="border border-border rounded-md p-4 hover:border-primary/50 transition-all duration-200 cursor-pointer group hover:shadow-sm"
												onClick={() => handleLensSelect(option.id)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														handleLensSelect(option.id);
													}
												}}
												role="button"
												tabIndex={0}
											>
												<div className="space-y-3">
													<div className="inline-block">
														<span className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-full">
															{option.title}
														</span>
													</div>
													<p className="text-sm text-muted-foreground leading-relaxed">
														{option.description}
													</p>
												</div>
											</div>
											{index < lensOptions.length - 1 && (
												<hr className="border-border/30" />
											)}
										</div>
									))}
								</div>
							)}

							{currentStep === "prescription-selection" && (
								<div className="space-y-3">
									{prescriptionOptions.map((option, index) => (
										<div key={option.id} className="space-y-2">
											<div
												className="border border-border rounded-md p-4 hover:border-primary/50 transition-all duration-200 cursor-pointer group hover:shadow-sm"
												onClick={() => handlePrescriptionSelect(option.id)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														handlePrescriptionSelect(option.id);
													}
												}}
												role="button"
												tabIndex={0}
											>
												<div className="space-y-3">
													<div className="flex items-center justify-between">
														<div className="inline-block">
															<span className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-full">
																{option.title}
															</span>
														</div>
														<div className="text-right">
															{option.isFree ? (
																<span className="text-sm font-medium text-muted-foreground">
																	grátis
																</span>
															) : (
																<span className="text-sm font-medium text-foreground">
																	+{formatPrice(option.price)}
																</span>
															)}
														</div>
													</div>
													<p className="text-sm text-muted-foreground leading-relaxed">
														{option.description}
													</p>
												</div>
											</div>
											{index < prescriptionOptions.length - 1 && (
												<hr className="border-border/30" />
											)}
										</div>
									))}
								</div>
							)}

							{currentStep === "finish-selection" && (
								<div className="space-y-3">
									{lensFinishOptions.map((option, index) => (
										<div key={option.id} className="space-y-2">
											<div
												className="border border-border rounded-md p-4 hover:border-primary/50 transition-all duration-200 cursor-pointer group hover:shadow-sm"
												onClick={() => handleFinishSelect(option.id)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														handleFinishSelect(option.id);
													}
												}}
												role="button"
												tabIndex={0}
											>
												<div className="space-y-3">
													<div className="flex items-center justify-between">
														<div className="inline-block">
															<span className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-full">
																{option.title}
															</span>
														</div>
														<div className="text-right">
															{option.isFree ? (
																<span className="text-sm font-medium text-muted-foreground">
																	grátis
																</span>
															) : (
																<span className="text-sm font-medium text-foreground">
																	+{formatPrice(option.price)}
																</span>
															)}
														</div>
													</div>
													<p className="text-sm text-muted-foreground leading-relaxed">
														{option.description}
													</p>
												</div>
											</div>
											{index < lensFinishOptions.length - 1 && (
												<hr className="border-border/30" />
											)}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</SheetPrimitive.Content>
			</SheetPrimitive.Portal>
		</Sheet>
	);
}
