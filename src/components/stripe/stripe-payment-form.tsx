"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CreditCard, type CreditCardValue } from "@/components/ui/credit-card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useCreatePaymentMethodMutation } from "@/http";

// Enhanced validation schema
const FormSchema = z
	.object({
		cardholderName: z
			.string()
			.min(2, "Nome do portador deve ter pelo menos 2 caracteres")
			.max(50, "Nome do portador deve ter menos de 50 caracteres"),

		cardNumber: z
			.string()
			.min(1, "Número do cartão é obrigatório")
			.refine((value) => {
				const cleanNumber = value.replace(/\s/g, "");
				return /^\d{13,19}$/.test(cleanNumber);
			}, "Formato de número de cartão inválido"),

		expiryMonth: z
			.string()
			.min(1, "Mês de expiração é obrigatório")
			.refine((value) => {
				const month = parseInt(value);
				return month >= 1 && month <= 12;
			}, "Mês inválido"),

		expiryYear: z
			.string()
			.min(1, "Ano de expiração é obrigatório")
			.refine((value) => {
				const year = parseInt(value);
				const currentYear = new Date().getFullYear();
				return year >= currentYear && year <= currentYear + 20;
			}, "Ano inválido"),

		cvv: z
			.string()
			.min(3, "CVV deve ter pelo menos 3 dígitos")
			.max(4, "CVV deve ter no máximo 4 dígitos")
			.refine((value) => /^\d+$/.test(value), "CVV deve conter apenas dígitos"),
	})
	// Add expiry date validation
	.refine(
		(data) => {
			if (!data.expiryMonth || !data.expiryYear) return true; // Let individual field validation handle this

			const currentDate = new Date();
			const currentYear = currentDate.getFullYear();
			const currentMonth = currentDate.getMonth() + 1;
			const expiryYear = parseInt(data.expiryYear);
			const expiryMonth = parseInt(data.expiryMonth);

			return (
				expiryYear > currentYear ||
				(expiryYear === currentYear && expiryMonth >= currentMonth)
			);
		},
		{
			message: "Cartão expirado",
			path: ["expiryYear"], // Show error on year field
		},
	);

type CreditCardFormData = z.infer<typeof FormSchema>;

interface StripePaymentFormProps {
	publishableKey: string;
	onCardDataChange?: (cardData: CreditCardValue, isValid: boolean) => void;
	onPaymentMethodCreated?: (paymentMethodId: string) => void;
	onError?: (error: string) => void;
}

function PaymentForm({
	onCardDataChange,
	onPaymentMethodCreated,
	onError,
}: Omit<StripePaymentFormProps, "publishableKey">) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [creditCard, setCreditCard] = useState<CreditCardValue>({
		cardholderName: "",
		cardNumber: "",
		expiryMonth: "",
		expiryYear: "",
		cvv: "",
	});
	const [isCardValid, setIsCardValid] = useState(false);

	const { mutate: createPaymentMethod } = useCreatePaymentMethodMutation({
		onSuccess: (data) => {
			console.log("Payment method created:", data.paymentMethodId);
			onPaymentMethodCreated?.(data.paymentMethodId);
			toast.success("Cartão validado com sucesso!");
			setIsProcessing(false);
		},
		onError: (error) => {
			console.error("Payment method creation error:", error);
			onError?.(error.message || "Erro ao processar cartão");
			toast.error(error.message || "Erro ao processar cartão");
			setIsProcessing(false);
		},
	});

	const form = useForm<CreditCardFormData>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			cardholderName: "",
			cardNumber: "",
			expiryMonth: "",
			expiryYear: "",
			cvv: "",
		},
		mode: "onChange", // Enable real-time validation
	});

	const handleCreditCardChange = (value: CreditCardValue) => {
		setCreditCard(value);

		// Update form values
		form.setValue("cardholderName", value.cardholderName, {
			shouldValidate: true,
		});
		form.setValue("cardNumber", value.cardNumber, { shouldValidate: true });
		form.setValue("expiryMonth", value.expiryMonth, { shouldValidate: true });
		form.setValue("expiryYear", value.expiryYear, { shouldValidate: true });
		form.setValue("cvv", value.cvv, { shouldValidate: true });

		// Notify parent of card data changes
		onCardDataChange?.(value, isCardValid && form.formState.isValid);
	};

	const handleValidationChange = (isValid: boolean) => {
		setIsCardValid(isValid);
		// Notify parent of validation changes
		onCardDataChange?.(creditCard, isValid && form.formState.isValid);
	};

	const onSubmit = async (data: CreditCardFormData) => {
		setIsProcessing(true);

		// Create payment method using the mutation hook
		createPaymentMethod({
			cardNumber: data.cardNumber.replace(/\s/g, ""),
			expiryMonth: parseInt(data.expiryMonth),
			expiryYear: parseInt(data.expiryYear),
			cvc: data.cvv,
			cardholderName: data.cardholderName,
		});
	};

	return (
		<div className="space-y-6">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="cardholderName"
						render={() => (
							<FormItem className="flex flex-col">
								<FormLabel>Informações do Cartão de Crédito</FormLabel>
								<FormControl>
									<CreditCard
										value={creditCard}
										onChange={handleCreditCardChange}
										onValidationChange={handleValidationChange}
										cvvLabel="CVC"
										cardStyle="base"
										showVendor={true}
										className="w-full"
									/>
								</FormControl>
								<FormDescription>
									Para teste, use: 4242 4242 4242 4242 (Visa) ou 5555 5555 5555
									4444 (Mastercard). Qualquer data futura e CVC válido.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Hidden fields to capture validation errors */}
					<div className="hidden">
						<FormField
							control={form.control}
							name="cardNumber"
							render={() => <FormMessage />}
						/>
						<FormField
							control={form.control}
							name="expiryMonth"
							render={() => <FormMessage />}
						/>
						<FormField
							control={form.control}
							name="expiryYear"
							render={() => <FormMessage />}
						/>
						<FormField
							control={form.control}
							name="cvv"
							render={() => <FormMessage />}
						/>
					</div>

					<Button
						type="submit"
						disabled={!form.formState.isValid || !isCardValid || isProcessing}
						className="w-full"
					>
						{isProcessing ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin mr-2" />
								Validando cartão...
							</>
						) : (
							"Validar cartão"
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}

export function StripePaymentForm(props: StripePaymentFormProps) {
	return <PaymentForm {...props} />;
}
