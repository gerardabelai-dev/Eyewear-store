import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
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

	void queryClient.prefetchQuery(getOrderSuccessQueryOptions(orderId));

	return (
		<>
			<h2 className="text-md text-vibrant -mb-6">Obrigado!</h2>

			<PageHeader
				title="Está a caminho"
				description={`Seu pedido #${orderId} foi processado e chegará em breve`}
				action={
					<Button disabled asChild variant="vibrant" size="lg">
						<Link href="/orders">Acompanhar pedido</Link>
					</Button>
				}
			/>

			<Suspense fallback={<OrderSuccessSkeleton />}>
				<OrderSuccessContent orderId={orderId} />
			</Suspense>
		</>
	);
}
