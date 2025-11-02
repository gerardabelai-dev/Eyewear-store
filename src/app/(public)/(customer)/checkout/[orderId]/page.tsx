import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { customer } from "@/lib/db/schema";
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

	// Get authenticated user and their customer data
	const user = await getCurrentUser();
	let authenticatedCustomer = null;

	if (user) {
		const customerData = await db.query.customer.findFirst({
			where: eq(customer.userId, user.id),
			with: {
				addresses: true,
				user: true,
			},
		});

		if (customerData) {
			authenticatedCustomer = {
				...customerData,
				userEmail: user.email,
			};
		}
	}

	return (
		<CheckoutProvider
			hasCustomer={hasCustomer}
			orderId={orderId}
			authenticatedCustomer={authenticatedCustomer}
		>
			<PageHeader
				title="Checkout"
				description="Verifique seu pedido e finalize sua compra"
			/>

			<section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
				<CheckoutAccordionForms orderId={orderId} />

				<Suspense fallback={<CheckoutOrderSummarySkeleton />}>
					<CheckoutOrderSummary orderId={orderId} />
				</Suspense>
			</section>
		</CheckoutProvider>
	);
}
