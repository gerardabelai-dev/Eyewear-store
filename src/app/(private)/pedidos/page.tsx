import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderCreationSheet } from "./order-creation-sheet";
import { OrdersStatistics } from "./orders-statistics";
import { OrdersTable } from "./orders-table";

export default function OrdersPage() {
	return (
		<>
			<PageHeader
				title="Pedidos"
				description="Gerencie seus pedidos e vendas"
				action={<OrderCreationSheet />}
			/>
			<Suspense fallback={<Skeleton className="h-32 w-full" />}>
				<OrdersStatistics />
			</Suspense>
			<Suspense fallback={<Skeleton className="h-96 w-full" />}>
				<OrdersTable />
			</Suspense>
		</>
	);
}
