import { Badge } from "@/components/ui/badge";
import type { GetOrderResponse } from "@/http/types";

interface OrderSummaryProps {
	order: GetOrderResponse["order"];
}

export function OrderSummary({ order }: OrderSummaryProps) {
	const cartProducts = order.cart?.cartProducts || [];

	// Calculate subtotal from cart products
	const subtotal =
		cartProducts.reduce((total, cartProduct) => {
			const productPrice = Array.isArray(cartProduct.product?.productPrice)
				? cartProduct.product.productPrice[0]
				: cartProduct.product?.productPrice;
			if (productPrice) {
				return total + productPrice.priceInCents * cartProduct.quantity;
			}
			return total;
		}, 0) / 100;

	// Get delivery cost
	const deliveryCost =
		(order.delivery?.orderDeliveryMethod?.costInCents || 0) / 100;

	// Get payment total
	const paymentTotal = (order.payment?.totalPriceInCents || 0) / 100;

	// Calculate discount (if payment total is less than subtotal + delivery)
	const expectedTotal = subtotal + deliveryCost;
	const discount =
		expectedTotal > paymentTotal ? expectedTotal - paymentTotal : 0;

	// Get coupon code if available
	const couponCode = order.payment?.couponCode;

	// Taxes are assumed to be included in the payment total for now
	const taxes = 0;

	return (
		<div className="flex flex-col gap-4 text-sm">
			<div className="flex gap-4 justify-between">
				<strong>Subtotal</strong>
				<span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
			</div>

			{discount > 0 && (
				<div className="flex gap-4 justify-between">
					<strong>Desconto {couponCode && <Badge>{couponCode}</Badge>}</strong>
					<span>-R$ {discount.toFixed(2).replace(".", ",")} </span>
				</div>
			)}

			<div className="flex gap-4 justify-between">
				<strong>Frete</strong>
				<span>R$ {deliveryCost.toFixed(2).replace(".", ",")}</span>
			</div>

			{taxes > 0 && (
				<div className="flex gap-4 justify-between">
					<strong>Taxas e impostos</strong>
					<span>R$ {taxes.toFixed(2).replace(".", ",")}</span>
				</div>
			)}

			<div className="flex gap-4 justify-between">
				<strong>Total</strong>
				<span>R$ {paymentTotal.toFixed(2).replace(".", ",")}</span>
			</div>
		</div>
	);
}
