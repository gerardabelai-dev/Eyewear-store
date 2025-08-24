import { CartProduct } from "@/components/ui/cart-product";
import { Separator } from "@/components/ui/separator";
import type { GetOrderResponse } from "@/http/types";

interface OrderItemsProps {
	order: GetOrderResponse["order"];
}

export function OrderItems({ order }: OrderItemsProps) {
	const cartProducts = order.cart?.cartProducts || [];

	if (cartProducts.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">
					Nenhum produto encontrado no pedido.
				</p>
			</div>
		);
	}

	return (
		<ul className="flex flex-col gap-4">
			{cartProducts.map((cartProduct, index) => {
				const product = cartProduct.product;
				const productPrice = Array.isArray(product?.productPrice)
					? product.productPrice[0]
					: product?.productPrice;
				const totalPrice = productPrice
					? (productPrice.priceInCents * cartProduct.quantity) / 100
					: 0;

				return (
					<div key={cartProduct.id}>
						<CartProduct productId={product?.id} imageSize="lg">
							<CartProduct.Image
								imageUrl={product?.images?.[0]?.imageUrl || ""}
								alt={product?.name || "Produto"}
								href="#"
								fallback={
									<div className="w-full h-full bg-muted rounded flex items-center justify-center">
										<span className="text-muted-foreground text-sm">
											Sem imagem
										</span>
									</div>
								}
							/>

							<CartProduct.Content>
								<CartProduct.Header>
									<CartProduct.Name name={product?.name || "Produto"} />
									<CartProduct.Description
										description={
											product?.description || "Descrição não disponível"
										}
									/>
									<CartProduct.Price
										priceInCents={productPrice?.priceInCents || 0}
									/>
								</CartProduct.Header>

								<CartProduct.QuantityDisplay
									quantity={cartProduct.quantity}
									unitPrice={totalPrice * 100} // Convert back to cents for formatPrice
								/>
							</CartProduct.Content>
						</CartProduct>

						{index < cartProducts.length - 1 && <Separator className="my-6" />}
					</div>
				);
			})}
		</ul>
	);
}
