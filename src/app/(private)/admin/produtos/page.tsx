import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCreationSheet } from "./product-creation-sheet";
import { ProductsStatistics } from "./products-statistics";
import { ProductsTable } from "./products-table";

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
			<Suspense fallback={<Skeleton className="h-32 w-full" />}>
				<ProductsStatistics />
			</Suspense>

			{/* Products Table - Stream with Suspense */}
			<Suspense fallback={<Skeleton className="h-96 w-full" />}>
				<ProductsTable />
			</Suspense>
		</>
	);
}
