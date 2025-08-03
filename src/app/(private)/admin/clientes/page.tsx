import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerCreationSheet } from "./customer-creation-sheet";
import { CustomersStatistics } from "./customer-statistics";
import { CustomersTable } from "./customer-table";

// Add revalidation time for ISR
export const revalidate = 60; // Revalidate every 60 seconds

export default function CustomersPage() {
	return (
		<>
			{/* Page Header - Renders immediately */}
			<PageHeader
				title="Clientes"
				description="Gerencie os clientes cadastrados na sua loja"
				action={<CustomerCreationSheet />}
			/>

			{/* Statistics Cards - Stream with Suspense */}
			<Suspense fallback={<Skeleton className="h-32 w-full" />}>
				<CustomersStatistics />
			</Suspense>

			{/* Customers Table - Stream with Suspense */}
			<Suspense fallback={<Skeleton className="h-96 w-full" />}>
				<CustomersTable />
			</Suspense>
		</>
	);
}
