import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { env } from "@/lib/env";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { CheckoutCustomerForm } from "./checkout-customer-form";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { CheckoutOrderSummarySkeleton } from "./checkout-order-summary-skeleton";
import { CheckoutPaymentMethodForm } from "./checkout-payment-method-form";
import { CheckoutShippingAddressForm } from "./checkout-shipping-address-form";
import { CheckoutShippingMethodForm } from "./checkout-shipping-method-form";
import { getOrderByIdQueryOptions } from "./get-checkout-query-options";

export default async function CheckoutPage({
	params,
}: {
	params: Promise<{ orderId?: string }>;
}) {
	const { orderId } = await params;

	if (!orderId) {
		notFound();
	}

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(getOrderByIdQueryOptions(orderId));

	return (
		<>
			<PageHeader
				title="Checkout"
				description="Verifique seu pedido e finalize sua compra"
			/>

			<section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
				<div className="flex flex-col gap-4">
					<CheckoutCustomerForm orderId={orderId} />
					<CheckoutShippingAddressForm orderId={orderId} />
					<CheckoutShippingMethodForm orderId={orderId} />
					<CheckoutPaymentMethodForm
						orderId={orderId}
						stripePublishableKey={env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
					/>
				</div>

				<Suspense fallback={<CheckoutOrderSummarySkeleton />}>
					<CheckoutOrderSummary
						orderId={orderId}
						stripePublishableKey={env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
					/>
				</Suspense>
			</section>
		</>
	);
}
