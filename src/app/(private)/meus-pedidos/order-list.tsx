"use client";

import { useQuery } from "@tanstack/react-query";
import {
	BadgeCheck,
	Clock,
	Package,
	PackageCheck,
	Truck,
	XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomerOrdersQueryOptions } from "@/http/orders/queries";
import type { OrderDelivery } from "@/lib/db/schema";
import { formatDate } from "@/lib/format-date";
import { formatPrice } from "@/lib/format-price";

function getDeliveryStatusDisplay(
	status: OrderDelivery["orderDeliveryStatus"],
) {
	switch (status) {
		case "delivered":
			return {
				icon: <BadgeCheck className="text-white fill-green-500 size-6" />,
				label: "Entregue",
			};
		case "shipped":
			return {
				icon: <Truck className="text-blue-500 size-6" />,
				label: "Em trânsito",
			};
		case "processing":
			return {
				icon: <Package className="text-orange-500 size-6" />,
				label: "Em processamento",
			};
		case "cancelled":
			return {
				icon: <XCircle className="text-red-500 size-6" />,
				label: "Cancelado",
			};
		case "returned":
			return {
				icon: <PackageCheck className="text-gray-500 size-6" />,
				label: "Devolvido",
			};
		default:
			return {
				icon: <Clock className="text-muted-foreground size-6" />,
				label: "Aguardando envio",
			};
	}
}

export function OrderList() {
	const { data: orders, isPending } = useQuery(getCustomerOrdersQueryOptions());

	if (isPending) {
		return <OrderListSkeleton />;
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
									<div className="flex gap-8 w-full">
										{/* Product image */}
										<div className="relative size-48 md:size-32 flex-shrink-0 aspect-square">
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

										<div className="flex flex-col gap-4 flex-1 min-w-0">
											<div className="flex gap-4 justify-between w-full">
												{/* Product name */}
												<strong className="font-medium">{product.name}</strong>

												{/* Product price */}
												<strong className="font-medium flex-shrink-0">
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
									<div className="flex gap-8 justify-between w-full">
										{/* Product delivery status */}
										<div className="flex gap-2 items-center">
											{getDeliveryStatusDisplay(deliveryStatus).icon}
											<span className="text-muted-foreground">
												{isDelivered ? (
													<>
														{getDeliveryStatusDisplay(deliveryStatus).label} em{" "}
														{formatDate(order.updatedAt)}
													</>
												) : (
													getDeliveryStatusDisplay(deliveryStatus).label
												)}
											</span>
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

function OrderListSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			{[1, 2].map((i) => (
				<div key={i} className="border border-muted rounded p-6 space-y-6">
					{/* Order Header Skeleton */}
					<div className="flex gap-8">
						<div className="flex flex-col gap-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-16" />
						</div>
						<div className="flex flex-col gap-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-3 w-24" />
						</div>
						<div className="flex flex-col gap-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-3 w-20" />
						</div>
						<div className="flex gap-4 ml-auto my-auto">
							<Skeleton className="h-9 w-24" />
						</div>
					</div>

					{/* Order Product Skeleton */}
					<div className="flex flex-col gap-4 pt-6 border-t border-muted">
						<div className="flex gap-8 w-full">
							<Skeleton className="size-48 md:size-32 flex-shrink-0 aspect-square rounded" />
							<div className="flex flex-col gap-4 flex-1 min-w-0">
								<div className="flex gap-4 justify-between w-full">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="h-5 w-24" />
								</div>
								<Skeleton className="h-16 w-full" />
							</div>
						</div>
						<div className="flex gap-8 justify-between w-full">
							<Skeleton className="h-6 w-48" />
							<div className="flex gap-2">
								<Skeleton className="h-8 w-24" />
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
