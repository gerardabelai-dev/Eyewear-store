import {
	CheckCircle,
	Clock,
	Package,
	ShoppingCart,
	TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrdersStatistics() {
	// Mock statistics
	const totalOrders = 156;
	const pendingOrders = 12;
	const processingOrders = 8;
	const completedOrders = 130;
	const _cancelledOrders = 6;
	const totalRevenue = 45780.5;
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
					<div className="text-2xl font-bold">{totalOrders}</div>
					<p className="text-xs text-muted-foreground">pedidos registrados</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Pendentes</CardTitle>
					<Clock className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{pendingOrders}</div>
					<p className="text-xs text-muted-foreground">aguardando ação</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Processando</CardTitle>
					<Package className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{processingOrders}</div>
					<p className="text-xs text-muted-foreground">em preparação</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Concluídos</CardTitle>
					<CheckCircle className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{completedOrders}</div>
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
						{totalRevenue.toLocaleString("pt-BR", {
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
