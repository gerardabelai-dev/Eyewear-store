"use client";

import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCustomerOrdersQueryOptions } from "@/http/orders/queries";
import { formatDate } from "@/lib/format-date";
import { formatPrice } from "@/lib/format-price";

export function OrderList() {
	const { data: orders, isLoading } = useQuery(getCustomerOrdersQueryOptions());

	if (isLoading) {
		return null;
	}

	if (!orders || orders.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<p className="text-muted-foreground text-lg mb-4">
					Você ainda não fez nenhum pedido
				</p>
				<Button asChild>
					<Link href="/">Explorar Produtos</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{orders.map((order) => {
				const totalPrice = order.payment?.totalPriceInCents ?? 0;
				const deliveryStatus = order.delivery?.orderDeliveryStatus ?? "pending";
				const isDelivered = deliveryStatus === "delivered";

				// Filter to get only main products (no parent)
				const mainProducts = order.cart.cartProducts.filter(
					(cp) => !cp.parentProductId,
				);

				return (
					<div
						key={order.id}
						className="border border-muted rounded p-6 text-sm"
					>
						{/* Order header */}
						<div className="flex gap-8">
							{/* Order Number */}
							<div className="flex flex-col gap-2">
								<strong className="font-medium">Número do Pedido</strong>
								<span className="text-xs">{order.id}</span>
							</div>

							{/* Order date */}
							<div className="flex flex-col gap-2">
								<strong className="font-medium">Pedido em</strong>
								<span className="text-xs">{formatDate(order.createdAt)}</span>
							</div>

							{/* Order total amount */}
							<div className="flex flex-col gap-2">
								<strong className="font-medium">Valor total</strong>
								<span className="font-medium text-xs">
									{formatPrice(totalPrice)}
								</span>
							</div>

							{/* Order actions */}
							<div className="flex gap-4 ml-auto my-auto">
								<Button variant="outline" size="sm" asChild>
									<Link href={`/orders/${order.id}`}>Ver Detalhes</Link>
								</Button>
							</div>
						</div>

						{/* Order products */}
						{mainProducts.map((cartProduct) => {
							const product = cartProduct.product;
							const mainImage = product.images[0];
							const price = cartProduct.productPrice;

							return (
								<div
									key={cartProduct.id}
									className="flex flex-col gap-4 mt-6 pt-6 border-t border-muted"
								>
									{/* Product image, name, details & price */}
									<div className="flex gap-8">
										{/* Product image */}
										<div className="relative size-48 md:size-32 w-full aspect-square">
											{mainImage ? (
												<Image
													src={mainImage.imageUrl}
													alt={product.name}
													className="object-cover rounded"
													quality={75}
													fill
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												/>
											) : (
												<div className="w-full h-full bg-muted rounded flex items-center justify-center">
													<span className="text-muted-foreground text-xs">
														Sem imagem
													</span>
												</div>
											)}
										</div>

										<div className="flex flex-col gap-4 w-full">
											<div className="flex gap-4 justify-between">
												{/* Product name */}
												<strong className="font-medium">{product.name}</strong>

												{/* Product price */}
												<strong className="font-medium">
													{price
														? formatPrice(price.priceInCents)
														: "Preço indisponível"}
												</strong>
											</div>

											{/* Product description */}
											{product.description && (
												<p className="text-muted-foreground line-clamp-3">
													{product.description}
												</p>
											)}
										</div>
									</div>

									{/* Order delivery date & actions */}
									<div className="flex gap-8 justify-between">
										{/* Product delivery status */}
										<div className="flex gap-2 items-center">
											{isDelivered ? (
												<>
													<BadgeCheck className="text-white fill-green-500 size-6" />
													<span className="text-muted-foreground">
														Entregue em {formatDate(order.updatedAt)}
													</span>
												</>
											) : (
												<>
													<Clock className="text-muted-foreground size-6" />
													<span className="text-muted-foreground">
														{deliveryStatus === "shipped"
															? "Em trânsito"
															: deliveryStatus === "processing"
																? "Em processamento"
																: "Aguardando envio"}
													</span>
												</>
											)}
										</div>

										{/* Product actions */}
										<div className="flex gap-2 items-center">
											<Button variant="link" size="sm" asChild>
												<Link href={`/products/${product.slug}`}>
													Ver Produto
												</Link>
											</Button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
