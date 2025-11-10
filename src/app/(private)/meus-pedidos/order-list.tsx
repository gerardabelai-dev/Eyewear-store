"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomerOrdersQueryOptions } from "@/http/orders/queries";
import { formatDate } from "@/lib/format-date";
import { formatPrice } from "@/lib/format-price";

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

				// Filter to get only main products (no parent)
				const mainProducts = order.cart.cartProducts.filter(
					(cp) => !cp.parentProductId,
				);

				// Check if order has pending prescriptions
				// Use same logic as OrderPrescriptionUpload component
				const parentProductsWithPrescription = mainProducts.filter(
					(parentProduct) => {
						const childLensOptions = order.cart.cartProducts.filter(
							(cp) =>
								cp.parentProductId === parentProduct.productId &&
								cp.product.requiresPrescription,
						);
						return childLensOptions.length > 0;
					},
				);

				const hasPendingPrescriptions = parentProductsWithPrescription.some(
					(cp) => cp.prescriptionStatus !== "uploaded",
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

						{/* Prescription alert */}
						{hasPendingPrescriptions && (
							<Alert className="mt-6 border-red-300 bg-red-500 text-white dark:bg-red-700/5 dark:border-red-500 dark:text-red-500">
								<AlertCircle className="h-4 w-4 text-white dark:text-red-500" />
								<AlertTitle className="text-white dark:text-red-500">
									Receita médica necessária
								</AlertTitle>
								<AlertDescription className="text-white/90 dark:text-red-500">
									Este pedido requer envio de receita médica. Clique em "Ver
									Detalhes" para fazer o upload.
								</AlertDescription>
							</Alert>
						)}

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
													{cartProduct.quantity > 1 && (
														<span className="ml-1 text-muted-foreground">
															x{cartProduct.quantity}
														</span>
													)}
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

									{/* Product actions */}
									<div className="flex gap-2 items-center justify-end w-full">
										<Button variant="link" size="sm" asChild>
											<Link href={`/products/${product.slug}`}>
												Ver Produto
											</Link>
										</Button>
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
