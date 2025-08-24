"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { StripePaymentForm } from "@/components/stripe/stripe-payment-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	getOrderByIdQueryOptions,
	getOrderPaymentMethodsQueryOptions,
	useCreatePaymentIntentMutation,
	useUpdateOrderPaymentMutation,
} from "@/http";
import { useCheckoutContext } from "./checkout-context";

interface CheckoutPaymentMethodFormProps {
	orderId: string;
	stripePublishableKey: string;
}

export function CheckoutPaymentMethodForm({
	orderId,
	stripePublishableKey,
}: CheckoutPaymentMethodFormProps) {
	const queryClient = useQueryClient();
	const { goToNextStep } = useCheckoutContext();
	const [, setStripeClientSecret] = useState<string | null>(null);
	const [, setPaymentIntentId] = useState<string | null>(null);
	const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
	const paymentIntentCreationAttempted = useRef(false);

	// Get order data to check existing payment information
	const { data: order } = useQuery(getOrderByIdQueryOptions(orderId));

	const { mutate: createPaymentIntent, isPending: isCreatingPaymentIntent } =
		useCreatePaymentIntentMutation({
			onSuccess: (data) => {
				console.log("💰 Payment intent created:", data);
				setStripeClientSecret(data.clientSecret);
				setPaymentIntentId(data.paymentIntentId);
				paymentIntentCreationAttempted.current = true;
			},
			onError: (error) => {
				console.error("Payment intent creation error:", error);
				paymentIntentCreationAttempted.current = true; // Mark as attempted even on error
				// Don't show error toast for "already has payment intent" error
				if (error.message !== "ORDER_ALREADY_HAS_STRIPE_PAYMENT_INTENT") {
					toast.error("Erro ao criar intenção de pagamento");
				}
			},
		});

	const { data: orderPaymentMethods = [] } = useQuery(
		getOrderPaymentMethodsQueryOptions(),
	);

	const { mutate: updateOrderPaymentMethod } = useUpdateOrderPaymentMutation({
		onSuccess: (data) => {
			console.log("Order payment updated:", data);
			// Invalidate order query to refresh checkout button state
			console.log("🔄 Invalidating order queries for orderId:", orderId);
			queryClient.invalidateQueries({
				queryKey: getOrderByIdQueryOptions(orderId).queryKey,
				exact: true,
			});
			console.log("✅ Order queries invalidated");
			// Move to next step after successful payment method setup with slight delay
			// to ensure query invalidation completes before focusing
			setTimeout(() => goToNextStep("payment-method"), 100);
		},
		onError: (error) => {
			console.error(error);
			toast.error("Erro ao atualizar método de pagamento");
		},
	});

	const handlePaymentIntentCreation = useCallback(() => {
		if (!paymentIntentCreationAttempted.current && !isCreatingPaymentIntent) {
			console.log("🔄 Creating payment intent for order:", orderId);
			createPaymentIntent({ orderId });
		}
	}, [orderId, createPaymentIntent, isCreatingPaymentIntent]);

	useEffect(() => {
		if (!order) return;

		if (order.payment?.stripeClientSecret) {
			console.log("✅ Order already has payment intent, using existing");
			setStripeClientSecret(order.payment.stripeClientSecret);
			if (order.payment.stripePaymentIntentId) {
				setPaymentIntentId(order.payment.stripePaymentIntentId);
			}
			// If order already has a payment method, set it as well
			if (order.payment.stripePaymentMethodId) {
				setPaymentMethodId(order.payment.stripePaymentMethodId);
			}
			paymentIntentCreationAttempted.current = true;
		} else {
			// Only create payment intent if we haven't attempted it yet
			handlePaymentIntentCreation();
		}
	}, [
		order?.payment?.stripeClientSecret,
		order?.payment?.stripePaymentIntentId,
		order?.payment?.stripePaymentMethodId,
		handlePaymentIntentCreation,
	]);

	// Focus cardholder name input when credit card form becomes visible
	useEffect(() => {
		if (!isCreatingPaymentIntent && !paymentMethodId) {
			// Form is now visible, focus the first input with a delay to ensure rendering is complete
			const timer = setTimeout(() => {
				const cardholderInput = document.querySelector(
					'[data-value="payment-method"] input[type="text"]',
				) as HTMLInputElement;
				if (cardholderInput) {
					cardholderInput.focus();
				}
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [isCreatingPaymentIntent, paymentMethodId]);

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

		// Note: Query invalidation is handled in the updateOrderPaymentMethod success callback
		// to avoid duplicate invalidations
	};

	const handlePaymentError = (error: string) => {
		console.error("Payment method creation failed:", error);
	};

	return (
		<div className="space-y-6">
			{isCreatingPaymentIntent && (
				<div className="flex items-center gap-2 text-muted-foreground">
					<Loader2 className="w-4 h-4 animate-spin" />
					<span>Preparando pagamento...</span>
				</div>
			)}

			{paymentMethodId && (
				<Alert className="bg-primary/10 border-primary/20 text-primary">
					<Check className="h-4 w-4" />
					<AlertDescription className="text-primary font-medium">
						Cartão validado com sucesso!
					</AlertDescription>
				</Alert>
			)}

			{!isCreatingPaymentIntent && !paymentMethodId && (
				<div className="space-y-4">
					<div className="flex items-center gap-3 mb-4">
						<CreditCard className="w-5 h-5" />
						<div className="text-left">
							<div className="font-medium">Cartão de Crédito</div>
							<div className="text-sm text-muted-foreground">
								Visa, Mastercard, American Express
							</div>
						</div>
					</div>
					<StripePaymentForm
						publishableKey={stripePublishableKey}
						onCardDataChange={handleCardDataChange}
						onPaymentMethodCreated={handlePaymentMethodCreated}
						onError={handlePaymentError}
					/>
				</div>
			)}
		</div>
	);
}
