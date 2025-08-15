import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cart, cartProduct, type ProductPrice } from "@/lib/db/schema";

export async function GET() {
	// Create cart
	const cartCreated = await db.insert(cart).values({}).returning();
	if (!cartCreated || cartCreated.length === 0) {
		return Response.json(
			{
				message: "Falha ao criar o carrinho",
			},
			{ status: 500 },
		);
	}
	const cartFound = await db.query.cart.findFirst({
		where: eq(cart.id, cartCreated[0].id),
	});

	if (!cartFound) {
		return Response.json(
			{
				message: "Cart not found",
			},
			{ status: 404 },
		);
	}

	// Fetch first 3 products and add to cart
	const products = await db.query.product.findMany({
		limit: 3,
		with: {
			productPrice: true,
		},
	});

	if (!products || products.length === 0) {
		return Response.json(
			{
				message: "Nenhum produto encontrado",
			},
			{ status: 404 },
		);
	}

	// Add products to cart
	const cartProductsCreated = [];
	for (const product of products) {
		const productPrice = product.productPrice[0] as ProductPrice;

		if (!productPrice) {
			continue;
		}

		const cartProductCreated = await db
			.insert(cartProduct)
			.values({
				cartId: cartFound.id,
				productId: product.id,
				productPriceId: productPrice.id,
				quantity: 1,
			})
			.returning();

		if (!cartProductCreated || cartProductCreated.length === 0) {
			return Response.json(
				{
					message: "Falha ao adicionar produto ao carrinho",
				},
				{ status: 500 },
			);
		}

		cartProductsCreated.push(cartProductCreated[0]);
	}

	// Fetch the complete cart with all relations
	const completeCart = await db.query.cart.findFirst({
		where: eq(cart.id, cartFound.id),
		with: {
			cartProducts: {
				with: {
					product: {
						with: {
							productPrice: true,
							images: true,
						},
					},
					productPrice: true,
				},
			},
		},
	});

	if (!completeCart) {
		return Response.json(
			{
				message: "Cart not found after creation",
			},
			{ status: 404 },
		);
	}

	return NextResponse.json({
		id: completeCart.id,
		items: completeCart.cartProducts,
		createdAt: completeCart.createdAt,
		updatedAt: completeCart.updatedAt,
	});
}
