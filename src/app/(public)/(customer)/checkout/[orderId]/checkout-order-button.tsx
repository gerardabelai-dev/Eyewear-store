"use client";

import { loadStripe } from "@stripe/stripe-js";
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
	stripePublishableKey: string;
}

export function CheckoutOrderButton({
	orderId,
	stripePublishableKey,
}: CheckoutOrderButtonProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { clearCartId } = useCartStore();
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	const { data: order, isPending: isLoadingOrder } = useQuery(
		getOrderByIdQueryOptions(orderId),
	);

	const handleFinishOrder = async () => {
		console.log(
			"🚀 Finishing order, needsPaymentProcessing:",
			needsPaymentProcessing,
		);

		if (needsPaymentProcessing) {
			console.log("💳 Processing payment...");
			await processPayment();
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
			hasClientSecret: !!order?.payment?.stripeClientSecret,
			hasPaymentMethodId: !!order?.payment?.stripePaymentMethodId,
			clientSecret: order?.payment?.stripeClientSecret,
			paymentMethodId: order?.payment?.stripePaymentMethodId,
		});

		if (
			!order?.payment?.stripeClientSecret ||
			!order?.payment?.stripePaymentMethodId
		) {
			console.error("❌ Missing payment information");
			toast.error("Informações de pagamento incompletas");
			return;
		}

		setIsProcessingPayment(true);

		try {
			console.log("🔑 Loading Stripe with key:", stripePublishableKey);

			if (!stripePublishableKey) {
				throw new Error("Chave pública do Stripe não configurada");
			}

			const stripe = await loadStripe(stripePublishableKey);
			if (!stripe) {
				throw new Error("Erro ao carregar Stripe");
			}

			console.log("✅ Stripe loaded successfully, confirming payment with:", {
				clientSecret: order.payment.stripeClientSecret,
				paymentMethodId: order.payment.stripePaymentMethodId,
			});

			// Confirm payment with Stripe
			console.log("💰 Calling stripe.confirmCardPayment...");
			const { error, paymentIntent } = await stripe.confirmCardPayment(
				order.payment.stripeClientSecret,
				{
					payment_method: order.payment.stripePaymentMethodId,
				},
			);

			console.log("📋 Payment result:", { error, paymentIntent });

			if (error) {
				console.error("Payment failed:", error);
				toast.error(error.message || "Erro no pagamento");
			} else if (paymentIntent?.status === "succeeded") {
				console.log("Payment succeeded:", paymentIntent);
				toast.success("Pagamento realizado com sucesso!");

				// Update order payment status to paid
				await updateOrderPaymentStatus(paymentIntent.id);

				// Clear cart and navigate to success
				clearCartId();
				router.push(`/checkout/${orderId}/success`);
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

	const updateOrderPaymentStatus = async (paymentIntentId: string) => {
		console.log("🔄 Updating order payment status to 'paid'...", {
			paymentIntentId,
			orderId,
		});

		try {
			const response = await fetch(
				`/api/orders/${orderId}/update-payment-status`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						paymentIntentId,
						status: "paid",
					}),
				},
			);

			console.log(
				"📤 Update payment status response:",
				response.status,
				response.statusText,
			);

			if (!response.ok) {
				throw new Error("Failed to update payment status");
			}

			// Refresh order data
			queryClient.invalidateQueries(getOrderByIdQueryOptions(orderId));
		} catch (error) {
			console.error("Failed to update payment status:", error);
			// Don't throw here as payment succeeded, just log the error
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
			<Button variant="vibrant" className="w-full" size="lg" disabled={true}>
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
			variant="vibrant"
			className="w-full"
			size="lg"
			disabled={isOrderPendingRequirements}
			onClick={!isOrderPendingRequirements ? handleFinishOrder : undefined}
		>
			{isOrderPendingRequirements ? getButtonText() : "Finalizar compra"}
		</Button>
	);
}
