"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrderByIdQueryOptions } from "@/http";

interface CheckoutOrderButtonProps {
	orderId: string;
}

export function CheckoutOrderButton({ orderId }: CheckoutOrderButtonProps) {
	const { data: order, isPending: isLoadingOrder } = useQuery(
		getOrderByIdQueryOptions(orderId),
	);

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
	// Payment should be available in the order data itself
	const isPendingPaymentInformation = !order?.payment?.orderPaymentMethodId;

	const isOrderPendingRequirements =
		isPendingCustomerInformation ||
		isPendingShippingInformation ||
		isPendingPaymentInformation;

	// Only show loading if we're actually fetching data
	const isLoading = isLoadingOrder;

	if (isLoading) {
		return (
			<Button variant="vibrant" className="w-full" size="lg" disabled={true}>
				<Loader2 className="w-4 h-4 animate-spin" />
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
			return "Selecione o método de pagamento";
		}
		return "Finalizar compra";
	};

	return (
		<Button
			asChild={!isOrderPendingRequirements}
			variant="vibrant"
			className="w-full"
			size="lg"
			disabled={isOrderPendingRequirements}
		>
			{isOrderPendingRequirements ? (
				getButtonText()
			) : (
				<Link href={`/checkout/${orderId}/success`}>Finalizar compra</Link>
			)}
		</Button>
	);
}
