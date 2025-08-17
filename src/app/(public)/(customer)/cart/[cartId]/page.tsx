import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { CartItems } from "./cart-items";
import { CartItemsSkeleton } from "./cart-items-skeleton";
import { CartSummary } from "./cart-summary";
import { CartSummarySkeleton } from "./cart-summary-skeleton";
import { getCartQueryOptions } from "./get-cart-query-options";

export default async function CartPage({
	params,
}: {
	params: Promise<{ cartId?: string }>;
}) {
	const { cartId } = await params;

	if (!cartId) {
		notFound();
	}

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(getCartQueryOptions(cartId));

	return (
		<>
			<PageHeader
				title="Carrinho"
				description="Gerencie seu carrinho de compras"
			/>

			<section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
				<Suspense fallback={<CartItemsSkeleton />}>
					<CartItems cartId={cartId} />
				</Suspense>

				<Suspense fallback={<CartSummarySkeleton />}>
					<CartSummary cartId={cartId} />
				</Suspense>
			</section>
		</>
	);
}
