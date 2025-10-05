"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getOrderByIdQueryOptions } from "@/http";
import { useCartStore } from "@/stores/cart-store";

interface CheckoutOrderButtonProps {
	orderId: string;
}

export function CheckoutOrderButton({
	orderId,
}: CheckoutOrderButtonProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { clearCartId } = useCartStore();
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	const { data: order, isPending: isLoadingOrder } = useQuery(
		getOrderByIdQueryOptions(orderId),
	);

	const handleFinishOrder = async () => {
		console.log("🚀 Finishing order, needsPaymentProcessing:", needsPaymentProcessing);
		console.log("📊 Order payment state:", {
			hasPaymentMethodId: !!order?.payment?.orderPaymentMethodId,
			hasStripePaymentMethodId: !!order?.payment?.stripePaymentMethodId,
			hasStripeClientSecret: !!order?.payment?.stripeClientSecret,
			paymentStatus: order?.payment?.orderPaymentStatus,
		});

		if (needsPaymentProcessing && order) {
			console.log("💳 Processing payment...");
			await processPayment();
			// processPayment will handle redirect after successful payment
		} else {
			console.log(
				"✅ Order already paid or doesn't need payment, proceeding to success",
			);
			// Order is already paid or doesn't need payment, proceed to success
			clearCartId();
			router.push(`/checkout/${orderId}/success`);
		}
	};

	const processPayment = async () => {
		console.log("🚀 Starting payment processing...");
		console.log("💳 Payment data:", {
			hasPaymentIntentId: !!order?.payment?.stripePaymentIntentId,
			hasPaymentMethodId: !!order?.payment?.stripePaymentMethodId,
			paymentIntentId: order?.payment?.stripePaymentIntentId,
			paymentMethodId: order?.payment?.stripePaymentMethodId,
		});

		if (
			!order?.payment?.stripePaymentIntentId ||
			!order?.payment?.stripePaymentMethodId
		) {
			console.error("❌ Missing payment information");
			toast.error("Informações de pagamento incompletas");
			return;
		}

		setIsProcessingPayment(true);

		try {
			// Confirm payment on the server (this will trigger webhooks)
			console.log("💰 Confirming payment on server...");
			const response = await fetch("/api/stripe/payment-intents/confirm", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					paymentIntentId: order.payment.stripePaymentIntentId,
					paymentMethodId: order.payment.stripePaymentMethodId,
				}),
			});

			console.log("📋 Payment confirmation response:", response.status);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || "Falha ao confirmar pagamento",
				);
			}

			const { paymentIntent } = await response.json();
			console.log("✅ Payment confirmed:", paymentIntent);

			if (paymentIntent.status === "succeeded") {
				toast.success("Pagamento realizado com sucesso!");

				// Wait a brief moment for webhook to process
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Clear cart and navigate to success
				clearCartId();
				router.push(`/checkout/${orderId}/success`);
			} else {
				throw new Error(`Status de pagamento inesperado: ${paymentIntent.status}`);
			}
		} catch (error) {
			console.error("Payment error:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Erro inesperado no pagamento";
			toast.error(errorMessage);
		} finally {
			setIsProcessingPayment(false);
		}
	};

	// Check if customer information is complete
	const isPendingCustomerInformation =
		!order?.customerId || !order?.customerAddressId;

	// Check if shipping information is complete
	// If customer info is not complete, shipping is also pending
	// If customer info is complete but no delivery exists, shipping is pending
	// If delivery exists but no method selected, shipping is pending
	const isPendingShippingInformation =
		isPendingCustomerInformation ||
		(!!order?.customerId &&
			!!order?.customerAddressId &&
			(!order?.delivery || !order?.delivery?.orderDeliveryMethodId));

	// Check if payment information is complete
	// Payment should be available in the order data itself AND credit card should be validated
	const isPendingPaymentInformation =
		!order?.payment?.orderPaymentMethodId ||
		!order?.payment?.stripePaymentMethodId;

	// Check if payment needs to be processed (has payment method but not paid)
	const needsPaymentProcessing =
		!!order?.payment?.orderPaymentMethodId &&
		!!order?.payment?.stripePaymentMethodId &&
		!!order?.payment?.stripeClientSecret &&
		order?.payment?.orderPaymentStatus === "pending";

	// Debug logging
	console.log("Payment processing check:", {
		hasPaymentMethodId: !!order?.payment?.orderPaymentMethodId,
		hasStripePaymentMethodId: !!order?.payment?.stripePaymentMethodId,
		hasStripeClientSecret: !!order?.payment?.stripeClientSecret,
		paymentStatus: order?.payment?.orderPaymentStatus,
		needsPaymentProcessing,
		orderPayment: order?.payment,
	});

	const isOrderPendingRequirements =
		isPendingCustomerInformation ||
		isPendingShippingInformation ||
		isPendingPaymentInformation;

	// Only show loading if we're actually fetching data or processing payment
	const isLoading = isLoadingOrder || isProcessingPayment;

	if (isLoading) {
		return (
			<Button variant="default" className="w-full" size="lg" disabled={true}>
				<Loader2 className="w-4 h-4 animate-spin" />
				{isProcessingPayment ? "Processando pagamento..." : ""}
			</Button>
		);
	}

	// Determine what's missing for better UX
	const getButtonText = () => {
		if (isPendingCustomerInformation) {
			return "Preencha suas informações";
		}
		if (isPendingShippingInformation) {
			return "Selecione o método de entrega";
		}
		if (isPendingPaymentInformation) {
			if (!order?.payment?.orderPaymentMethodId) {
				return "Selecione o método de pagamento";
			}
			if (!order?.payment?.stripePaymentMethodId) {
				return "Valide seu cartão de crédito";
			}
		}
		return "Finalizar compra";
	};

	return (
		<Button
			variant="default"
			className="w-full"
			size="lg"
			disabled={isOrderPendingRequirements}
			onClick={!isOrderPendingRequirements ? handleFinishOrder : undefined}
			data-checkout-order-button
		>
			{isOrderPendingRequirements ? getButtonText() : "Finalizar compra"}
		</Button>
	);
}
