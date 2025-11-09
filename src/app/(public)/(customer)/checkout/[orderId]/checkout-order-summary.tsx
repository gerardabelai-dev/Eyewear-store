"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import type { GetOrderResponse } from "@/http/types";
import { calculateDiscountedPrice, formatPrice } from "@/lib/format-price";
import { CheckoutCouponForm } from "./checkout-coupon-form";
import { CheckoutOrderButton } from "./checkout-order-button";
import { getOrderByIdQueryOptions } from "./get-checkout-query-options";

interface CheckoutOrderSummaryProps {
	orderId: string;
}

type OrderData = GetOrderResponse["order"];
type CartProductData = NonNullable<OrderData["cart"]>["cartProducts"][0];

function calculateItemTotal(item: CartProductData): number {
	// Use productPrice from cartProduct if available, otherwise fall back to product.productPrice
	const productPrice = item.productPrice || item.product.productPrice;

	if (!productPrice) {
		console.warn("No product price found for item:", item.id);
		return 0;
	}

	const discountedPrice = calculateDiscountedPrice(
		productPrice.priceInCents,
		productPrice.discountPercentage,
	);
	return discountedPrice * item.quantity;
}

export function CheckoutOrderSummary({ orderId }: CheckoutOrderSummaryProps) {
	const { data: order, refetch } = useSuspenseQuery(
		getOrderByIdQueryOptions(orderId),
	);

	// Get cart products from the order
	const cartProducts = order.cart?.cartProducts || [];

	if (cartProducts.length === 0) {
		return (
			<div className="flex flex-col gap-4 bg-muted p-8 rounded h-fit sticky top-14">
				<h2 className="text-lg font-bold">Resumo do pedido</h2>
				<p className="text-sm text-muted-foreground">
					Nenhum produto encontrado no pedido.
				</p>
			</div>
		);
	}

	// Calculate subtotal from all cart products
	const subtotalInCents = cartProducts.reduce(
		(total, item: CartProductData) => {
			return total + calculateItemTotal(item);
		},
		0,
	);

	// Get delivery cost if available
	const deliveryCostInCents =
		order.delivery?.orderDeliveryMethod?.costInCents || 1000; // Default R$ 10,00

	// For now, using fixed values for taxes
	// These could be calculated based on delivery method, location, etc.
	const taxesInCents = 1000; // R$ 10,00

	// Get coupon discount if applied
	const discountInCents = order.payment?.discountInCents || 0;
	const appliedCouponCode = order.payment?.couponCode || null;
	const appliedCoupon = order.payment?.coupon || null;

	const totalInCents =
		subtotalInCents + deliveryCostInCents + taxesInCents - discountInCents;

	// Format discount label based on coupon type
	const getDiscountLabel = () => {
		if (!appliedCoupon) return "Desconto";

		if (appliedCoupon.type === "percentage") {
			return `Desconto (${appliedCoupon.discountPercentage}%)`;
		}

		if (appliedCoupon.type === "fixed_amount") {
			return `Desconto (${formatPrice(appliedCoupon.discountAmountInCents || 0)})`;
		}

		return "Desconto";
	};

	return (
		<div className="flex flex-col gap-4 bg-muted p-8 rounded h-fit sticky top-14">
			<h2 className="text-lg font-bold">Resumo do pedido</h2>

			<div className="flex gap-2 justify-between">
				<span>Subtotal</span>
				<strong>{formatPrice(subtotalInCents)}</strong>
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<span>Frete</span>
				<strong>{formatPrice(deliveryCostInCents)}</strong>
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<span>Taxas e impostos</span>
				<strong>{formatPrice(taxesInCents)}</strong>
			</div>

			<Separator />

			{discountInCents > 0 && (
				<>
					<div className="flex gap-2 justify-between">
						<span>{getDiscountLabel()}</span>
						<strong className="text-emerald-600">
							-{formatPrice(discountInCents)}
						</strong>
					</div>

					<Separator />
				</>
			)}

			<div className="flex gap-2 justify-between">
				<span>Total</span>
				<strong>{formatPrice(totalInCents)}</strong>
			</div>

			<Separator />

			<CheckoutCouponForm
				orderId={orderId}
				appliedCouponCode={appliedCouponCode}
				onCouponApplied={() => refetch()}
			/>

			<CheckoutOrderButton orderId={orderId} />
		</div>
	);
}
