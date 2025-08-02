import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { category, product, subcategory } from "@/lib/db/schema";

export async function getProductsQuery({ page = 1, limit = 10 } = {}) {
	return db
		.select({
			id: product.id,
			name: product.name,
			description: product.description,
			price: product.price,
			stock: product.stock,
			status: product.status,
			images: product.images,
			categoryId: product.categoryId,
			subcategoryId: product.subcategoryId,
			categoryName: category.name,
			subcategoryName: subcategory.name,
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		})
		.from(product)
		.leftJoin(category, eq(product.categoryId, category.id))
		.leftJoin(subcategory, eq(product.subcategoryId, subcategory.id))
		.orderBy(asc(product.name))
		.limit(limit)
		.offset((page - 1) * limit);
}

export async function getProductByIdQuery(_productId: string) {
	// Similar select with where eq(product.id, productId)
}

export async function getProductStatsQuery() {
	// Get all products with necessary fields for statistics
	const products = await db
		.select({
			id: product.id,
			price: product.price,
			stock: product.stock,
			status: product.status,
		})
		.from(product);

	// Calculate statistics
	const totalProducts = products.length;
	const activeProducts = products.filter((p) => p.status === "active").length;
	const lowStockProducts = products.filter((p) => p.stock <= 10).length;
	const totalValue = products.reduce(
		(acc, p) => acc + parseFloat(p.price.toString()) * p.stock,
		0,
	);

	return {
		totalProducts,
		activeProducts,
		lowStockProducts,
		totalValue,
	};
}
