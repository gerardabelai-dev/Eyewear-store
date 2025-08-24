"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { CartProduct } from "@/components/ui/cart-product";
import { Separator } from "@/components/ui/separator";
import {
	useRemoveProductFromCart,
	useUpdateCartProductQuantity,
} from "@/http/cart/mutations";
import type { GetCartResponse } from "@/http/types";
import { calculateDiscountedPrice } from "@/lib/format-price";

import { getCartQueryOptions } from "./get-cart-query-options";

type CartItemData = GetCartResponse["items"][0];

function CartItem({ item, cartId }: { item: CartItemData; cartId: string }) {
	const product = item.product;
	const productPrice = item.productPrice;
	const quantity = item.quantity;

	const removeProductMutation = useRemoveProductFromCart();
	const updateQuantityMutation = useUpdateCartProductQuantity();

	// Get the first product image or use a placeholder
	const imageUrl =
		product.images?.[0]?.imageUrl ||
		"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg";

	// Calculate actual price considering discount
	const discountedPrice = calculateDiscountedPrice(
		productPrice.priceInCents,
		productPrice.discountPercentage,
	);

	const handleRemoveProduct = () => {
		removeProductMutation.mutate(
			{
				cartId,
				productId: product.id,
			},
			{
				onSuccess: () => {
					// If this was the last item in cart, clear the cart store
					// The query will be invalidated and refetched by the mutation
				},
			},
		);
	};

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity <= 0) {
			handleRemoveProduct();
			return;
		}

		updateQuantityMutation.mutate({
			cartId,
			productId: product.id,
			quantity: newQuantity,
		});
	};

	const handleIncrement = () => {
		handleQuantityChange(quantity + 1);
	};

	const handleDecrement = () => {
		handleQuantityChange(quantity - 1);
	};

	const isLoading =
		updateQuantityMutation.isPending || removeProductMutation.isPending;

	return (
		<CartProduct productId={product.id} imageSize="md">
			<CartProduct.Image
				imageUrl={imageUrl}
				alt={product.name}
				href={`/products/${product.id}`}
			/>

			<CartProduct.Content>
				<CartProduct.Header>
					<CartProduct.Name name={product.name} />
					{product.description && (
						<CartProduct.Description description={product.description} />
					)}
					<CartProduct.Price
						priceInCents={discountedPrice}
						originalPriceInCents={productPrice.priceInCents}
						discountPercentage={productPrice.discountPercentage}
					/>
				</CartProduct.Header>

				{/* Mobile Actions */}
				<CartProduct.Actions mobileLayout>
					<CartProduct.QuantityControls
						quantity={quantity}
						maxQuantity={product.stock}
						onIncrement={handleIncrement}
						onDecrement={handleDecrement}
						disabled={isLoading}
					/>
					<CartProduct.Delete
						onDelete={handleRemoveProduct}
						disabled={isLoading}
						mobileLayout
					/>
				</CartProduct.Actions>

				<CartProduct.Stock stock={product.stock} />
			</CartProduct.Content>

			{/* Desktop Actions */}
			<CartProduct.Actions>
				<CartProduct.QuantityControls
					quantity={quantity}
					maxQuantity={product.stock}
					onIncrement={handleIncrement}
					onDecrement={handleDecrement}
					disabled={isLoading}
				/>
			</CartProduct.Actions>

			<CartProduct.Delete onDelete={handleRemoveProduct} disabled={isLoading} />
		</CartProduct>
	);
}

export function CartItems({ cartId }: { cartId: string }) {
	const { data } = useSuspenseQuery(getCartQueryOptions(cartId));

	if (!data.items || data.items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<p className="text-lg text-muted-foreground">Seu carrinho está vazio</p>
				<p className="text-sm text-muted-foreground mt-2">
					Adicione produtos para continuar
				</p>
			</div>
		);
	}

	return (
		<ul className="flex flex-col gap-4">
			{data.items.map((item: CartItemData, index: number) => (
				<div key={item.id}>
					<CartItem item={item} cartId={cartId} />
					{index < data.items.length - 1 && <Separator className="my-6" />}
				</div>
			))}
		</ul>
	);
}
