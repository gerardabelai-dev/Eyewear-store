import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { getOrderStatusDisplay } from "./get-order-status-display";
import { getOrderSuccessQueryOptions } from "./get-order-success-query-options";
import { OrderSuccessContent } from "./order-success-content";
import { OrderSuccessSkeleton } from "./order-success-skeleton";

export default async function CheckoutSuccessPage({
	params,
}: {
	params: Promise<{ orderId: string }>;
}) {
	const { orderId } = await params;

	if (!orderId) {
		notFound();
	}

	const queryClient = getQueryClient();

	// Fetch order data to get the actual order status
	const order = await queryClient.fetchQuery(
		getOrderSuccessQueryOptions(orderId),
	);

	if (!order) {
		notFound();
	}

	// Get user-friendly status message based on actual order status
	const statusDisplay = getOrderStatusDisplay(order.orderStatus);

	return (
		<>
			<h2 className="text-md text-primary -mb-6">Obrigado!</h2>

			<PageHeader
				title={statusDisplay.title}
				description={`${statusDisplay.description}. Pedido #${orderId}`}
				action={
					<div className="flex gap-2">
						<Button asChild variant="link" size="lg">
							<Link href="/meus-pedidos">Ver todos os pedidos</Link>
						</Button>
						<Button asChild variant="default" size="lg">
							<Link href={`/orders/${orderId}`}>Acompanhar pedido</Link>
						</Button>
					</div>
				}
			/>

			<Suspense fallback={<OrderSuccessSkeleton />}>
				<OrderSuccessContent orderId={orderId} />
			</Suspense>
		</>
	);
}
