"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrderByIdQueryOptions } from "./get-checkout-query-options";

interface CheckoutOrderButtonProps {
	orderId: string;
}

export function CheckoutOrderButton({ orderId }: CheckoutOrderButtonProps) {
	const { data: order, isPending: IsLoadingOrder } = useQuery(
		getOrderByIdQueryOptions(orderId),
	);

	const isPendingCustomerInformation =
		!order?.customerId || !order?.customerAddressId;

	// TODO: fetch order delivery
	const isPendingShippingInformation = false;
	// TODO: fetch order payment
	const isPendingPaymentInformation = false;

	const isOrderPendingRequirements =
		isPendingCustomerInformation ||
		isPendingShippingInformation ||
		isPendingPaymentInformation;

	// TODO: add other loading states, if any of them are loading them should be disabled
	const isLoading = IsLoadingOrder;

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
