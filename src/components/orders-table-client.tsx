import { OrdersTableWrapper } from "@/components/orders-table-wrapper";

export function OrdersTableClient() {
	// Mock orders data
	const orders = [
		{
			id: "1",
			orderNumber: "ORD-2024-001",
			userId: "1",
			customerName: "João Silva",
			customerEmail: "joao.silva@example.com",
			customerPhone: "(11) 98765-4321",
			statusId: "1",
			totalAmount: "3599.90",
			notes: "Entregar no período da manhã",
			createdAt: new Date("2024-01-20"),
			updatedAt: new Date("2024-01-20"),
		},
		{
			id: "2",
			orderNumber: "ORD-2024-002",
			userId: "1",
			customerName: "Maria Santos",
			customerEmail: "maria.santos@example.com",
			customerPhone: "(21) 99876-5432",
			statusId: "2",
			totalAmount: "149.70",
			notes: undefined,
			createdAt: new Date("2024-01-19"),
			updatedAt: new Date("2024-01-19"),
		},
		{
			id: "3",
			orderNumber: "ORD-2024-003",
			userId: "1",
			customerName: "Pedro Oliveira",
			customerEmail: "pedro.oliveira@example.com",
			customerPhone: "(31) 97654-3210",
			statusId: "3",
			totalAmount: "1899.00",
			notes: "Cliente VIP - Priorizar entrega",
			createdAt: new Date("2024-01-18"),
			updatedAt: new Date("2024-01-18"),
		},
	];

	// Mock order statuses
	const orderStatuses = [
		{
			id: "1",
			name: "Pendente",
			color: "#FFA500",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "2",
			name: "Processando",
			color: "#0000FF",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "3",
			name: "Concluído",
			color: "#008000",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "4",
			name: "Cancelado",
			color: "#FF0000",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	return <OrdersTableWrapper orders={orders} orderStatuses={orderStatuses} />;
}
