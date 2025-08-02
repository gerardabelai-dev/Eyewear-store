import { Suspense } from "react";
import { OrderCreationSheet } from "@/components/order-creation-sheet";
import { OrdersStatistics } from "@/components/orders-statistics";
import { OrdersStatisticsSkeleton } from "@/components/orders-statistics-skeleton";
import { OrdersTableClient } from "@/components/orders-table-client";
import { OrdersTableSkeleton } from "@/components/orders-table-skeleton";
import { OrdersTableWrapper } from "@/components/orders-table-wrapper";
import { PageHeader } from "@/components/shared/page-header";

export default function OrdersPage() {
	return (
		<>
			<PageHeader
				title="Pedidos"
				description="Gerencie seus pedidos e vendas"
				action={<OrderCreationSheet />}
			/>
			<Suspense fallback={<OrdersStatisticsSkeleton />}>
				<OrdersStatistics />
			</Suspense>
			<Suspense fallback={<OrdersTableSkeleton />}>
				<OrdersTableClient />
			</Suspense>
		</>
	);
}
