import { Suspense } from "react";
import { OrderCreationSheet } from "@/components/order-creation-sheet";
import { OrdersStatistics } from "@/components/orders-statistics";
import { OrdersStatisticsSkeleton } from "@/components/orders-statistics-skeleton";
import { OrdersTableServer } from "@/components/orders-table-server";
import { OrdersTableSkeleton } from "@/components/orders-table-skeleton";
import { PageHeader } from "@/components/shared/page-header";

// Remove force-dynamic to allow caching
// export const dynamic = "force-dynamic";

// Add revalidation time for ISR (Incremental Static Regeneration)
export const revalidate = 60; // Revalidate every 60 seconds

export default function OrdersPage() {
	return (
		<>
			{/* Page Header - Renders immediately */}
			<PageHeader
				title="Pedidos"
				description="Acompanhe e gerencie os pedidos dos clientes"
				action={<OrderCreationSheet />}
			/>

			{/* Statistics Cards - Stream with Suspense */}
			<Suspense fallback={<OrdersStatisticsSkeleton />}>
				<OrdersStatistics />
			</Suspense>

			{/* Orders Table - Stream with Suspense */}
			<Suspense fallback={<OrdersTableSkeleton />}>
				<OrdersTableServer />
			</Suspense>
		</>
	);
}
