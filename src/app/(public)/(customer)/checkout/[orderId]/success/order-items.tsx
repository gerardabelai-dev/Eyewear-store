import Image from "next/image";
import Link from "next/link";
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
				const productPrice = product?.productPrice?.[0];
				const totalPrice = productPrice
					? (productPrice.priceInCents * cartProduct.quantity) / 100
					: 0;
				const unitPrice = productPrice ? productPrice.priceInCents / 100 : 0;

				return (
					<div key={cartProduct.id}>
						<li className="flex gap-4">
							<Link
								href="/cart"
								className="relative w-48 md:w-96 h-full aspect-video"
							>
								{product?.images?.[0]?.imageUrl ? (
									<Image
										src={product.images[0].imageUrl}
										alt={product.name || "Produto"}
										className="object-cover rounded"
										quality={75}
										fill
									/>
								) : (
									<div className="w-full h-full bg-muted rounded flex items-center justify-center">
										<span className="text-muted-foreground text-sm">
											Sem imagem
										</span>
									</div>
								)}
							</Link>

							<div className="flex flex-col justify-between gap-2">
								<div className="flex flex-col gap-2">
									<h2 className="text-lg font-bold">
										{product?.name || "Produto"}
									</h2>
									<span className="text-sm text-muted-foreground">
										{product?.description || "Descrição não disponível"}
									</span>
									<strong className="text-md">
										R$ {unitPrice.toFixed(2).replace(".", ",")}
									</strong>
								</div>
								<div className="flex flex-col md:flex-row md:items-center gap-2">
									<span className="text-sm text-muted-foreground">
										Quantidade: {cartProduct.quantity}
									</span>

									<Separator
										className="hidden md:block"
										orientation="vertical"
									/>

									<span className="text-sm text-muted-foreground">
										Preço: R$ {totalPrice.toFixed(2).replace(".", ",")}
									</span>
								</div>
							</div>
						</li>

						{index < cartProducts.length - 1 && <Separator className="my-6" />}
					</div>
				);
			})}
		</ul>
	);
}
