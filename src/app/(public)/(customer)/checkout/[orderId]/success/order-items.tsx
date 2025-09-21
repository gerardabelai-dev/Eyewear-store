import { Info } from "lucide-react";
import { CartProduct } from "@/components/ui/cart-product";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GetOrderResponse } from "@/http/types";
import { calculateDiscountedPrice, formatPrice } from "@/lib/format-price";
import {
	type GroupedCartItem,
	groupCartItems,
} from "@/lib/utils/group-cart-items";

interface OrderItemsProps {
	order: GetOrderResponse["order"];
}

type OrderCartItem = NonNullable<
	GetOrderResponse["order"]["cart"]
>["cartProducts"][0];

type TransformedOrderCartItem = OrderCartItem & {
	productPrice: {
		priceInCents: number;
		discountPercentage: number | null;
	};
};

function LensOption({ item }: { item: OrderCartItem }) {
	// Get the product price, handling the array case
	const productPrice = Array.isArray(item.product?.productPrice)
		? item.product.productPrice[0]
		: item.product?.productPrice;

	if (!productPrice) {
		return null;
	}

	// Calculate lens option price
	const lensPrice = calculateDiscountedPrice(
		productPrice.priceInCents,
		productPrice.discountPercentage,
	);

	return (
		<li className="flex items-center gap-2 text-sm text-muted-foreground ml-4 mt-1">
			<span>{item.product?.name}</span>
			{lensPrice > 0 && <span>({formatPrice(lensPrice)})</span>}
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Info className="h-3 w-3 cursor-help" />
					</TooltipTrigger>
					<TooltipContent>
						<p className="max-w-xs">{item.product?.description}</p>
						{lensPrice > 0 && (
							<strong className="block mt-2 font-bold">
								Custo adicional: {formatPrice(lensPrice)}
							</strong>
						)}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</li>
	);
}

function OrderItem({
	groupedItem,
}: {
	groupedItem: GroupedCartItem<TransformedOrderCartItem>;
}) {
	const item = groupedItem.glasses;
	const product = item.product;
	const quantity = groupedItem.totalQuantity;

	// Get the product price, handling the array case
	const productPrice = Array.isArray(product?.productPrice)
		? product.productPrice[0]
		: product?.productPrice;

	if (!productPrice) {
		return null;
	}

	// Calculate total price including lens options
	const lensOptionsPrice = groupedItem.lensOptions.reduce(
		(total, lensOption) => {
			const lensProductPrice = Array.isArray(lensOption.product?.productPrice)
				? lensOption.product.productPrice[0]
				: lensOption.product?.productPrice;

			if (!lensProductPrice) return total;

			const lensDiscountedPrice = calculateDiscountedPrice(
				lensProductPrice.priceInCents,
				lensProductPrice.discountPercentage,
			);
			return total + lensDiscountedPrice;
		},
		0,
	);

	// Calculate glasses price considering discount
	const glassesDiscountedPrice = calculateDiscountedPrice(
		productPrice.priceInCents,
		productPrice.discountPercentage,
	);

	// Total price per unit (glasses + all lens options)
	const totalPricePerUnit = glassesDiscountedPrice + lensOptionsPrice;

	return (
		<CartProduct productId={product?.id} imageSize="lg">
			<CartProduct.Image
				imageUrl={product?.images?.[0]?.imageUrl || ""}
				alt={product?.name || "Produto"}
				href="#"
				fallback={
					<div className="w-full h-full bg-muted rounded flex items-center justify-center">
						<span className="text-muted-foreground text-sm">Sem imagem</span>
					</div>
				}
			/>

			<CartProduct.Content>
				<CartProduct.Header>
					<CartProduct.Name name={product?.name || "Produto"} />
					<CartProduct.Description
						description={product?.description || "Descrição não disponível"}
					/>

					{/* Display lens options */}
					{groupedItem.lensOptions.length > 0 && (
						<ul className="mt-2">
							<div className="text-base font-bold text-foreground mb-1">
								Lentes
							</div>
							{groupedItem.lensOptions.map((lensOption) => (
								<LensOption key={lensOption.id} item={lensOption} />
							))}
						</ul>
					)}

					<CartProduct.Price priceInCents={totalPricePerUnit} />
				</CartProduct.Header>

				<CartProduct.QuantityDisplay
					quantity={quantity}
					unitPrice={totalPricePerUnit}
				/>
			</CartProduct.Content>
		</CartProduct>
	);
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

	// Transform cart products to match the expected format for grouping
	const itemsForGrouping = cartProducts.map((cartProduct) => {
		const productPrice = Array.isArray(cartProduct.product?.productPrice)
			? cartProduct.product.productPrice[0]
			: cartProduct.product?.productPrice;

		return {
			...cartProduct,
			productPrice: {
				priceInCents: productPrice?.priceInCents || 0,
				discountPercentage: productPrice?.discountPercentage || null,
			},
		};
	});

	// Group items using the shared utility
	const groupedItems = groupCartItems(
		itemsForGrouping,
	) as GroupedCartItem<TransformedOrderCartItem>[];

	return (
		<ul className="flex flex-col gap-4">
			{groupedItems.map((groupedItem, index) => (
				<div key={groupedItem.combinationKey}>
					<OrderItem groupedItem={groupedItem} />
					{index < groupedItems.length - 1 && <Separator className="my-6" />}
				</div>
			))}
		</ul>
	);
}
