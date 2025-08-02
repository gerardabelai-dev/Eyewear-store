import { asc, count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { category, product, subcategory } from "@/lib/db/schema";

// Implement getCategoryDetailsQuery, etc.

export async function getSubcategoriesByCategoryQuery(categoryId: string) {
	return db
		.select()
		.from(subcategory)
		.where(eq(subcategory.categoryId, categoryId))
		.orderBy(asc(subcategory.name));
}

export async function getCategoriesWithCountsQuery() {
	// Get all categories with their counts
	const categories = await db
		.select({
			id: category.id,
			name: category.name,
			description: category.description,
		})
		.from(category)
		.orderBy(asc(category.name));

	// Get counts for each category
	const categoriesWithCounts = await Promise.all(
		categories.map(async (cat) => {
			const subcategoriesCount = await db
				.select({ count: count() })
				.from(subcategory)
				.where(eq(subcategory.categoryId, cat.id));

			const productsCount = await db
				.select({ count: count() })
				.from(product)
				.where(eq(product.categoryId, cat.id));

			return {
				...cat,
				subcategoriesCount: subcategoriesCount[0]?.count || 0,
				productsCount: productsCount[0]?.count || 0,
			};
		}),
	);

	return categoriesWithCounts;
}

export async function getCategoriesQuery({ page = 1, limit = 10 } = {}) {
	return db
		.select({
			id: category.id,
			name: category.name,
			description: category.description,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
		})
		.from(category)
		.orderBy(asc(category.name))
		.limit(limit)
		.offset((page - 1) * limit);
}
