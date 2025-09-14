import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
	collection,
	collectionProduct,
	product,
	productPrice,
} from "@/lib/db/schema";

export async function GET() {
	try {
		// Fetch all active collections with their products and prices
		const collections = await db
			.select({
				id: collection.id,
				name: collection.name,
				slug: collection.slug,
				description: collection.description,
				isActive: collection.isActive,
			})
			.from(collection)
			.where(eq(collection.isActive, true))
			.orderBy(collection.createdAt);

		// For each collection, fetch its products with prices
		const collectionsWithProducts = await Promise.all(
			collections.map(async (col) => {
				const products = await db
					.select({
						id: product.id,
						name: product.name,
						slug: product.slug,
						description: product.description,
						stock: product.stock,
						status: product.status,
						priceInCents: productPrice.priceInCents,
						discountPercentage: productPrice.discountPercentage,
						isDefault: productPrice.isDefault,
					})
					.from(collectionProduct)
					.innerJoin(product, eq(collectionProduct.productId, product.id))
					.innerJoin(
						productPrice,
						and(
							eq(productPrice.productId, product.id),
							eq(productPrice.isDefault, true),
						),
					)
					.where(
						and(
							eq(collectionProduct.collectionId, col.id),
							eq(product.status, "active"),
						),
					)
					.orderBy(product.createdAt);

				return {
					...col,
					products,
				};
			}),
		);

		return NextResponse.json(collectionsWithProducts);
	} catch (error) {
		console.error("Error fetching collections:", error);
		return NextResponse.json(
			{ error: "Failed to fetch collections" },
			{ status: 500 },
		);
	}
}
