import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { CheckoutCouponForm } from "./checkout-coupon-form";
import { CheckoutCustomerForm } from "./checkout-customer-form";
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

			<h1 className="text-lg font-bold">DEBUG: {orderId}</h1>

			<section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
				<div className="flex flex-col gap-4">
					<CheckoutCustomerForm orderId={orderId} />
					<CheckoutShippingAddressForm orderId={orderId} />
					<CheckoutShippingMethodForm />
					<CheckoutPaymentMethodForm />
				</div>

				{/* Order Summary */}
				<div className="flex flex-col gap-4 bg-muted p-8 rounded h-fit sticky top-14">
					<h2 className="text-lg font-bold">Resumo do pedido</h2>

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

					<Separator />

					<CheckoutCouponForm />

					<Button asChild variant="vibrant" className="w-full" size="lg">
						<Link href="/checkout/success">Finalizar compra</Link>
					</Button>
				</div>
			</section>
		</>
	);
}
