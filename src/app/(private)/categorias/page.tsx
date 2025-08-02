import { Suspense } from "react";
import { CategoriesStatistics } from "@/components/categories-statistics";
import { CategoriesTableClient } from "@/components/categories-table-client";
import { CategoryCreationSheet } from "@/components/category-creation-sheet";
import { OrdersTableSkeleton } from "@/components/orders-table-skeleton";
import { ProductsStatisticsSkeleton } from "@/components/products-statistics-skeleton";
import { PageHeader } from "@/components/shared/page-header";

// Add revalidation time for ISR
export const revalidate = 60; // Revalidate every 60 seconds

export default function CategoriesPage() {
	return (
		<>
			{/* Page Header - Renders immediately */}
			<PageHeader
				title="Categorias"
				description="Organize seus produtos em categorias e subcategorias"
				action={<CategoryCreationSheet />}
			/>

			{/* Statistics Cards - Stream with Suspense */}
			<Suspense fallback={<ProductsStatisticsSkeleton />}>
				<CategoriesStatistics />
			</Suspense>

			{/* Categories Table - Stream with Suspense */}
			<Suspense fallback={<OrdersTableSkeleton />}>
				<CategoriesTableClient />
			</Suspense>
		</>
	);
}
