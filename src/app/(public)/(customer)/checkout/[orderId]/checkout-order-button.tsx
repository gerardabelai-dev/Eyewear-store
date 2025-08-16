"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrderByIdQueryOptions, getOrderDeliveryQueryOptions } from "@/http";

interface CheckoutOrderButtonProps {
	orderId: string;
}

export function CheckoutOrderButton({ orderId }: CheckoutOrderButtonProps) {
	const { data: order, isPending: isLoadingOrder } = useQuery(
		getOrderByIdQueryOptions(orderId),
	);

	const { data: orderDelivery, isPending: isLoadingOrderDelivery } = useQuery({
		...getOrderDeliveryQueryOptions(orderId),
		enabled: !!order?.customerId && !!order?.customerAddressId,
	});

	const isPendingCustomerInformation =
		!order?.customerId || !order?.customerAddressId;

	const isPendingShippingInformation = !orderDelivery?.orderDeliveryMethodId;

	// Check if order has payment information (this is included in the order data)
	const isPendingPaymentInformation = !order?.payment?.orderPaymentMethodId;

	const isOrderPendingRequirements =
		isPendingCustomerInformation ||
		isPendingShippingInformation ||
		isPendingPaymentInformation;

	const isLoading = isLoadingOrder || isLoadingOrderDelivery;

	if (isLoading) {
		return (
			<Button variant="vibrant" className="w-full" size="lg" disabled={true}>
				<Loader2 className="w-4 h-4 animate-spin" />
			</Button>
		);
	}

	return (
		<Button
			asChild
			variant="vibrant"
			className="w-full"
			size="lg"
			disabled={isOrderPendingRequirements}
		>
			<Link href={`/checkout/${orderId}/success`}>Finalizar compra</Link>
		</Button>
	);
}
