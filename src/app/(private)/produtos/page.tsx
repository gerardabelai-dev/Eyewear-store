import { Suspense } from "react";
import { OrdersTableSkeleton } from "@/components/orders-table-skeleton";
import { ProductCreationSheet } from "@/components/product-creation-sheet";
import { ProductsStatistics } from "@/components/products-statistics";
import { ProductsStatisticsSkeleton } from "@/components/products-statistics-skeleton";
import { ProductsTableServer } from "@/components/products-table-server";
import { PageHeader } from "@/components/shared/page-header";

// Add revalidation time for ISR
export const revalidate = 60; // Revalidate every 60 seconds

export default function ProductsPage() {
	return (
		<>
			{/* Page Header - Renders immediately */}
			<PageHeader
				title="Produtos"
				description="Gerencie o catálogo de produtos da sua loja"
				action={<ProductCreationSheet />}
			/>

			{/* Statistics Cards - Stream with Suspense */}
			<Suspense fallback={<ProductsStatisticsSkeleton />}>
				<ProductsStatistics />
			</Suspense>

			{/* Products Table - Stream with Suspense */}
			<Suspense fallback={<OrdersTableSkeleton />}>
				<ProductsTableServer />
			</Suspense>
		</>
	);
}
