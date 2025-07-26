import {
	AlertCircle,
	CheckCircle,
	Clock,
	Package,
	ShoppingCart,
	TrendingUp,
} from "lucide-react";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { OrderCreationSheet } from "@/components/order-creation-sheet";
import { OrdersTableWrapper } from "@/components/orders-table-wrapper";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getOrderStats, getOrders } from "@/lib/actions/order";
import { getOrderStatuses } from "@/lib/actions/order-status";
import { getSession } from "@/lib/auth-server";

// Force dynamic rendering for authenticated pages
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
	const [ordersResult, statsResult, statusesResult] = await Promise.all([
		getOrders(),
		getOrderStats(),
		getOrderStatuses(),
	]);

	if (ordersResult.error || statsResult.error || statusesResult.error) {
		console.error(
			"Error loading orders, stats, or statuses:",
			ordersResult.error || statsResult.error || statusesResult.error,
		);
		// Don't redirect, show empty state instead
	}

	const orders = ordersResult.data || [];
	const orderStatuses = statusesResult.data || [];
	const stats = statsResult.data || {
		totalOrders: 0,
		pendingOrders: 0,
		processingOrders: 0,
		completedOrders: 0,
		cancelledOrders: 0,
		totalRevenue: 0,
	};

	return (
		<>
			{/* Page Header */}
			<PageHeader
				title="Pedidos"
				description="Acompanhe e gerencie os pedidos dos clientes"
				action={<OrderCreationSheet />}
			/>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total de Pedidos
						</CardTitle>
						<ShoppingCart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalOrders}</div>
						<p className="text-xs text-muted-foreground">pedidos registrados</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pendentes</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.pendingOrders}</div>
						<p className="text-xs text-muted-foreground">aguardando ação</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Processando</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.processingOrders}</div>
						<p className="text-xs text-muted-foreground">em preparação</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Concluídos</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.completedOrders}</div>
						<p className="text-xs text-muted-foreground">pedidos finalizados</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Faturamento</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							R${" "}
							{stats.totalRevenue.toLocaleString("pt-BR", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</div>
						<p className="text-xs text-muted-foreground">pedidos concluídos</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Pedidos Registrados</CardTitle>
					<CardDescription>
						{stats.totalOrders > 0
							? `${stats.totalOrders} pedido${
									stats.totalOrders > 1 ? "s" : ""
								} encontrado${stats.totalOrders > 1 ? "s" : ""}`
							: "Nenhum pedido registrado ainda"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<OrdersTableWrapper orders={orders} orderStatuses={orderStatuses} />
				</CardContent>
			</Card>
		</>
	);
}
