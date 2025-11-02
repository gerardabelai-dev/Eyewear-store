import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { getOrderByIdQueryOptions } from "@/http/orders/queries";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { OrdersPageContent } from "./orders-page-content";
import { OrdersPageSkeleton } from "./orders-page-skeleton";

export default async function OrdersPage({
	params,
}: {
	params: Promise<{ orderId: string }>;
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
				title={`Pedido #${orderId}`}
				description="Confira os detalhes do seu pedido"
				action={
					<Button asChild variant="link" size="lg">
						<Link href="/meus-pedidos">Ver todos os pedidos</Link>
					</Button>
				}
			/>

			<Suspense fallback={<OrdersPageSkeleton />}>
				<OrdersPageContent orderId={orderId} />
			</Suspense>
		</>
	);
}
