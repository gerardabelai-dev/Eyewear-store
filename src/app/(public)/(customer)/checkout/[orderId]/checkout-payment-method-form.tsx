"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StripePaymentForm } from "@/components/stripe/stripe-payment-form";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardTitle } from "@/components/ui/card";
import {
	getOrderByIdQueryOptions,
	getOrderPaymentMethodsQueryOptions,
	useCreateOrderPaymentMutation,
	useCreatePaymentIntentMutation,
} from "@/http";

interface CheckoutPaymentMethodFormProps {
	orderId: string;
	stripePublishableKey: string;
}

export function CheckoutPaymentMethodForm({
	orderId,
	stripePublishableKey,
}: CheckoutPaymentMethodFormProps) {
	const queryClient = useQueryClient();
	const [, setStripeClientSecret] = useState<string | null>(null);
	const [, setPaymentIntentId] = useState<string | null>(null);
	const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

	const { mutate: createPaymentIntent, isPending: isCreatingPaymentIntent } =
		useCreatePaymentIntentMutation({
			onSuccess: (data) => {
				console.log("💰 Payment intent created:", data);
				setStripeClientSecret(data.clientSecret);
				setPaymentIntentId(data.paymentIntentId);
			},
			onError: (error) => {
				console.error(error);
				toast.error("Erro ao criar intenção de pagamento");
			},
		});

	const { data: orderPaymentMethods = [] } = useQuery(
		getOrderPaymentMethodsQueryOptions(),
	);

	const { mutate: updateOrderPaymentMethod } = useCreateOrderPaymentMutation({
		onSuccess: (data) => {
			console.log("Order payment updated:", data);
			// Invalidate order query to refresh checkout button state
			console.log("🔄 Invalidating order queries for orderId:", orderId);
			queryClient.invalidateQueries(getOrderByIdQueryOptions(orderId));
			// Also invalidate with exact query key pattern
			queryClient.invalidateQueries({ queryKey: ["order", { id: orderId }] });
			queryClient.invalidateQueries({ queryKey: ["order"] });
			console.log("✅ Order queries invalidated");
		},
		onError: (error) => {
			console.error(error);
			toast.error("Erro ao atualizar método de pagamento");
		},
	});

	useEffect(() => {
		createPaymentIntent({ orderId });
	}, [orderId, createPaymentIntent]);

	const handleCardDataChange = (_cardData: any, _isValid: boolean) => {
		// Card data changes are handled internally by the StripePaymentForm
		// This callback is kept for future use if needed
	};

	const handlePaymentMethodCreated = (paymentMethodId: string) => {
		console.log("Payment method created:", paymentMethodId);
		setPaymentMethodId(paymentMethodId);

		// Find Credit Card payment method and update order
		const creditCardMethod = orderPaymentMethods.find(
			(method) => method.method === "Credit Card",
		);

		if (creditCardMethod) {
			updateOrderPaymentMethod({
				orderId,
				orderPaymentMethodId: creditCardMethod.id,
				stripePaymentMethodId: paymentMethodId,
			});
		}

		// Refresh the page data
		queryClient.invalidateQueries(getOrderByIdQueryOptions(orderId));
	};

	const handlePaymentError = (error: string) => {
		console.error("Payment method creation failed:", error);
	};

	return (
		<Card className="p-8 space-y-8">
			<CardTitle className="flex items-center gap-2">
				<CreditCard className="w-5 h-5" />
				Método de pagamento
			</CardTitle>

			{isCreatingPaymentIntent && (
				<div className="flex items-center gap-2 text-muted-foreground">
					<Loader2 className="w-4 h-4 animate-spin" />
					<span>Preparando pagamento...</span>
				</div>
			)}

			{paymentMethodId && (
				<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
					<p className="text-green-800 font-medium">
						✅ Cartão validado com sucesso!
					</p>
				</div>
			)}

			{!isCreatingPaymentIntent && !paymentMethodId && (
				<Accordion type="single" defaultValue="credit-card" className="w-full">
					<AccordionItem value="credit-card">
						<AccordionTrigger className="hover:no-underline">
							<div className="flex items-center gap-3">
								<CreditCard className="w-5 h-5" />
								<div className="text-left">
									<div className="font-medium">Cartão de Crédito</div>
									<div className="text-sm text-muted-foreground">
										Visa, Mastercard, American Express
									</div>
								</div>
							</div>
						</AccordionTrigger>
						<AccordionContent className="pt-6">
							<StripePaymentForm
								publishableKey={stripePublishableKey}
								onCardDataChange={handleCardDataChange}
								onPaymentMethodCreated={handlePaymentMethodCreated}
								onError={handlePaymentError}
							/>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			)}
		</Card>
	);
}
