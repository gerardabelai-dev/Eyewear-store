"use client";

import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderForm } from "@/components/forms/order-form-simple";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Order, OrderStatus } from "@/lib/types";

interface OrdersTableWrapperProps {
	orders: Order[];
	orderStatuses: OrderStatus[];
}

export function OrdersTableWrapper({
	orders,
	orderStatuses,
}: OrdersTableWrapperProps) {
	const [editingOrder, setEditingOrder] = useState<Order | null>(null);

	const handleEditOrder = (order: Order) => {
		setEditingOrder(order);
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
								<TableCell>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleEditOrder(order)}
									>
										<Edit className="h-4 w-4" />
									</Button>
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
		</>
	);
}
