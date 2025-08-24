import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { CheckoutAccordionForms } from "./checkout-accordion-forms";
import { CheckoutProvider } from "./checkout-context";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { CheckoutOrderSummarySkeleton } from "./checkout-order-summary-skeleton";
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

	// Get order data to check if customer exists
	const orderData = await queryClient.fetchQuery(
		getOrderByIdQueryOptions(orderId),
	);
	const hasCustomer = !!orderData?.customerId;

	return (
		<CheckoutProvider hasCustomer={hasCustomer}>
			<PageHeader
				title="Checkout"
				description="Verifique seu pedido e finalize sua compra"
			/>

			<section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
				<CheckoutAccordionForms orderId={orderId} />

				<Suspense fallback={<CheckoutOrderSummarySkeleton />}>
					<CheckoutOrderSummary
						orderId={orderId}
						stripePublishableKey={
							process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
						}
					/>
				</Suspense>
			</section>
		</CheckoutProvider>
	);
}
