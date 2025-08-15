import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { CartItems } from "./cart-items";
import { CartItemsSkeleton } from "./cart-items-skeleton";
import { getCartQueryOptions } from "./get-cart-query-options";

export default async function CartPage({
	params,
}: {
	params: Promise<{ cart_id?: string }>;
}) {
	const { cart_id } = await params;

	if (!cart_id) {
		notFound();
	}

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(getCartQueryOptions(cart_id));

	return (
		<>
			<PageHeader
				title="Carrinho"
				description="Gerencie seu carrinho de compras"
			/>

			<section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
				<Suspense fallback={<CartItemsSkeleton />}>
					<CartItems cartId={cart_id} />
				</Suspense>

				{/* Order Summary */}
				<div className="flex flex-col gap-4 bg-muted p-8 rounded h-fit sticky top-14">
					<h2 className="text-lg font-bold">Resumo da compra</h2>

					<div className="flex gap-2 justify-between">
						<span>Subtotal</span>
						<strong>R$ 100,00</strong>
					</div>

					<Separator />

					<div className="flex gap-2 justify-between">
						<span>Frete</span>
						<strong>R$ 10,00</strong>
					</div>

					<Separator />

					<div className="flex gap-2 justify-between">
						<span>Taxas e impostos</span>
						<strong>R$ 10,00</strong>
					</div>

					<Separator />

					<div className="flex gap-2 justify-between">
						<span>Total</span>
						<strong>R$ 120,00</strong>
					</div>

					<Button asChild variant="vibrant" className="w-full" size="lg">
						<Link href="/checkout">Finalizar compra</Link>
					</Button>
				</div>
			</section>
		</>
	);
}
