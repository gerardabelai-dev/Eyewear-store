"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenericDeleteDialog } from "@/components/ui/generic-delete-dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Order, OrderStatus } from "@/lib/types";
import { OrderForm } from "./order-form";

// Mock data - in a real app this would come from props or server action
const getMockOrders = (): Order[] => [
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

const getMockOrderStatuses = (): OrderStatus[] => [
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

interface OrdersTableProps {
	orders?: Order[];
	orderStatuses?: OrderStatus[];
}

export function OrdersTable({
	orders: ordersProp,
	orderStatuses: orderStatusesProp,
}: OrdersTableProps) {
	const orders = ordersProp || getMockOrders();
	const orderStatuses = orderStatusesProp || getMockOrderStatuses();
	const [editingOrder, setEditingOrder] = useState<Order | null>(null);
	const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleEditOrder = (order: Order) => {
		setEditingOrder(order);
	};

	const handleDeleteOrder = (order: Order) => {
		setDeletingOrder(order);
	};

	const confirmDeleteOrder = async () => {
		if (!deletingOrder) return;

		setIsDeleting(true);

		// Mock loading delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Mock success (you can simulate error by uncommenting the line below)
		// throw new Error("Simulated API error");

		toast.success("Pedido excluído com sucesso!");
		setDeletingOrder(null);
		setIsDeleting(false);
	};

	const getStatusBadge = (statusId: string) => {
		const status = orderStatuses.find((s) => s.id === statusId);
		if (!status) return <Badge>Desconhecido</Badge>;

		return (
			<Badge style={{ backgroundColor: status.color, color: "#fff" }}>
				{status.name}
			</Badge>
		);
	};

	const formatCurrency = (value: string) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(parseFloat(value));
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("pt-BR").format(date);
	};

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Número</TableHead>
							<TableHead>Cliente</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Data</TableHead>
							<TableHead className="w-[100px]">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((order) => (
							<TableRow key={order.id}>
								<TableCell className="font-medium">
									{order.orderNumber}
								</TableCell>
								<TableCell>{order.customerName}</TableCell>
								<TableCell>{getStatusBadge(order.statusId)}</TableCell>
								<TableCell>{formatCurrency(order.totalAmount)}</TableCell>
								<TableCell>{formatDate(order.createdAt)}</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<span className="sr-only">Abrir menu</span>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Ações</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => handleEditOrder(order)}
												className="cursor-pointer"
											>
												<Edit className="mr-2 h-4 w-4" />
												Editar
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => handleDeleteOrder(order)}
												className="cursor-pointer"
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Deletar
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{editingOrder && (
				<Drawer
					trigger={<></>}
					title="Editar Pedido"
					icon={<Edit className="h-4 w-4" />}
					open={!!editingOrder}
					onOpenChange={(open) => !open && setEditingOrder(null)}
				>
					<OrderForm
						order={editingOrder}
						onSuccess={() => {
							setEditingOrder(null);
							toast.success("Pedido atualizado com sucesso!");
						}}
					/>
				</Drawer>
			)}

			{/* Delete Order Dialog */}
			<GenericDeleteDialog
				open={!!deletingOrder}
				onOpenChange={(open) => {
					if (!open) setDeletingOrder(null);
				}}
				itemId={deletingOrder?.id || ""}
				itemName={deletingOrder?.orderNumber || ""}
				itemType="pedido"
				onConfirm={confirmDeleteOrder}
				isLoading={isDeleting}
			/>
		</>
	);
}
