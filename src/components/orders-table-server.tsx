import { OrdersTableWrapper } from "@/components/orders-table-wrapper";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getOrders } from "@/lib/actions/order";
import { getOrderStatuses } from "@/lib/actions/order-status";

export async function OrdersTableServer() {
	const [ordersResult, statusesResult] = await Promise.all([
		getOrders(),
		getOrderStatuses(),
	]);

	if (ordersResult.error || statusesResult.error) {
		console.error(
			"Error loading orders or statuses:",
			ordersResult.error || statusesResult.error,
		);
	}

	const orders = ordersResult.data || [];
	const orderStatuses = statusesResult.data || [];
	const totalOrders = orders.length;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pedidos Registrados</CardTitle>
				<CardDescription>
					{totalOrders > 0
						? `${totalOrders} pedido${
								totalOrders > 1 ? "s" : ""
							} encontrado${totalOrders > 1 ? "s" : ""}`
						: "Nenhum pedido registrado ainda"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<OrdersTableWrapper orders={orders} orderStatuses={orderStatuses} />
			</CardContent>
		</Card>
	);
}
