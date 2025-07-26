import {
	AlertCircle,
	CheckCircle,
	Clock,
	Package,
	ShoppingCart,
	TrendingUp,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getOrderStats } from "@/lib/actions/order";

export async function OrdersStatistics() {
	const statsResult = await getOrderStats();

	if (statsResult.error) {
		console.error("Error loading order stats:", statsResult.error);
	}

	const stats = statsResult.data || {
		totalOrders: 0,
		pendingOrders: 0,
		processingOrders: 0,
		completedOrders: 0,
		cancelledOrders: 0,
		totalRevenue: 0,
	};

	return (
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
	);
}
