import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriesStatistics } from "./categories-statistics";
import { CategoriesTable } from "./categories-table";
import { CategoryCreationSheet } from "./category-creation-sheet";

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
			<Suspense fallback={<Skeleton className="h-32 w-full" />}>
				<CategoriesStatistics />
			</Suspense>

			{/* Categories Table - Stream with Suspense */}
			<Suspense fallback={<Skeleton className="h-96 w-full" />}>
				<CategoriesTable />
			</Suspense>
		</>
	);
}
