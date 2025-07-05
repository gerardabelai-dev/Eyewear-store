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
import { OrdersTable } from "@/components/orders-table";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getOrderStats, getOrders } from "@/lib/actions/order";
import { getUserProfile } from "@/lib/actions/user";
import { getCurrentUser } from "@/lib/auth-server";

export default async function PedidosPage() {
	const user = await getCurrentUser();
	if (!user) {
		redirect("/auth");
	}

	// Load user profile for header
	const userResult = await getUserProfile();
	if (userResult.error || !userResult.data) {
		redirect("/auth");
	}

	const [ordersResult, statsResult] = await Promise.all([
		getOrders(),
		getOrderStats(),
	]);

	if (ordersResult.error || statsResult.error) {
		console.error(
			"Error loading orders or stats:",
			ordersResult.error || statsResult.error,
		);
		// Don't redirect, show empty state instead
	}

	const userProfile = userResult.data;
	const orders = ordersResult.data || [];
	const stats = statsResult.data || {
		totalOrders: 0,
		pendingOrders: 0,
		processingOrders: 0,
		completedOrders: 0,
		cancelledOrders: 0,
		totalRevenue: 0,
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userInitials = getInitials(
		`${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() ||
			"User",
	);

	const userName =
		`${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() ||
		"Usuário";

	return (
		<div className="flex flex-col">
			<DashboardHeader
				userImage={userProfile.image}
				userInitials={userInitials}
				userName={userName}
				userEmail={userProfile.email}
			/>

			<main className="flex-1 space-y-6 p-6">
				{/* Page Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
						<p className="text-muted-foreground">
							Gerencie seus pedidos e acompanhe o faturamento
						</p>
					</div>
					<OrderCreationSheet />
				</div>

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
							<p className="text-xs text-muted-foreground">
								pedidos registrados
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Pendentes</CardTitle>
							<Clock className="h-4 w-4 text-yellow-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.pendingOrders}</div>
							<p className="text-xs text-muted-foreground">
								aguardando processamento
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Em Processamento
							</CardTitle>
							<Package className="h-4 w-4 text-blue-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.processingOrders}</div>
							<p className="text-xs text-muted-foreground">sendo preparados</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Concluídos</CardTitle>
							<CheckCircle className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.completedOrders}</div>
							<p className="text-xs text-muted-foreground">
								pedidos finalizados
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Faturamento</CardTitle>
							<TrendingUp className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								R${" "}
								{stats.totalRevenue.toLocaleString("pt-BR", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<p className="text-xs text-muted-foreground">
								pedidos concluídos
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Status Overview */}
				<Card>
					<CardHeader>
						<CardTitle>Status dos Pedidos</CardTitle>
						<CardDescription>
							Visão geral do status atual dos pedidos
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						<Badge variant="secondary" className="whitespace-nowrap">
							{stats.pendingOrders} Pendentes
						</Badge>
						<Badge
							variant="outline"
							className="whitespace-nowrap border-blue-200 text-blue-700"
						>
							{stats.processingOrders} Em Processamento
						</Badge>
						<Badge
							variant="outline"
							className="whitespace-nowrap border-green-200 text-green-700"
						>
							{stats.completedOrders} Concluídos
						</Badge>
						{stats.cancelledOrders > 0 && (
							<Badge
								variant="outline"
								className="whitespace-nowrap border-red-200 text-red-700"
							>
								{stats.cancelledOrders} Cancelados
							</Badge>
						)}
					</CardContent>
				</Card>

				{/* Orders Table */}
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
						<OrdersTable orders={orders} />
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
