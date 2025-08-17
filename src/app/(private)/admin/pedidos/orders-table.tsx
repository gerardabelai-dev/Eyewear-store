"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type { Order, OrderDelivery, OrderPayment } from "@/lib/db/schema";
import { OrderForm } from "./order-form";

// Extended Order type with customer and status information for table display
type OrderWithDetails = Order & {
	customerName?: string;
	customerEmail?: string;
	deliveryStatus?: OrderDelivery["orderDeliveryStatus"];
	paymentStatus?: OrderPayment["orderPaymentStatus"];
	productCount?: number;
};

// Mock data - in a real app this would come from props or server action
const getMockOrders = (): OrderWithDetails[] => [
	{
		id: "order_1",
		orderStatus: "pending",
		cartId: "cart_1",
		customerId: "customer_1",
		customerAddressId: "customerAddress_1",
		createdAt: new Date("2024-01-20"),
		updatedAt: new Date("2024-01-20"),
		customerName: "João Silva",
		customerEmail: "joao.silva@example.com",
		deliveryStatus: "processing",
		paymentStatus: "paid",
		productCount: 3,
	},
	{
		id: "order_2",
		orderStatus: "pending",
		cartId: "cart_2",
		customerId: "customer_2",
		customerAddressId: "customerAddress_2",
		createdAt: new Date("2024-01-19"),
		updatedAt: new Date("2024-01-19"),
		customerName: "Maria Santos",
		customerEmail: "maria.santos@example.com",
		deliveryStatus: "shipped",
		paymentStatus: "paid",
		productCount: 1,
	},
	{
		id: "order_3",
		orderStatus: "pending",
		cartId: "cart_3",
		customerId: "customer_3",
		customerAddressId: "customerAddress_3",
		createdAt: new Date("2024-01-18"),
		updatedAt: new Date("2024-01-18"),
		customerName: "Pedro Oliveira",
		customerEmail: "pedro.oliveira@example.com",
		deliveryStatus: "delivered",
		paymentStatus: "paid",
		productCount: 2,
	},
	{
		id: "order_4",
		customerId: "customer_4",
		customerAddressId: "customerAddress_4",
		orderStatus: "pending",
		cartId: "cart_4",
		createdAt: new Date("2024-01-17"),
		updatedAt: new Date("2024-01-17"),
		customerName: "Ana Costa",
		customerEmail: "ana.costa@example.com",
		deliveryStatus: "pending",
		paymentStatus: "pending",
		productCount: 1,
	},
];

interface OrdersTableProps {
	orders?: OrderWithDetails[];
}

export function OrdersTable({ orders: ordersProp }: OrdersTableProps) {
	const orders = ordersProp || getMockOrders();
	const [editingOrder, setEditingOrder] = useState<OrderWithDetails | null>(
		null,
	);
	const [deletingOrder, setDeletingOrder] = useState<OrderWithDetails | null>(
		null,
	);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleEditOrder = (order: OrderWithDetails) => {
		setEditingOrder(order);
	};

	const handleDeleteOrder = (order: OrderWithDetails) => {
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

	const getDeliveryStatusBadge = (
		status?: OrderWithDetails["deliveryStatus"],
	) => {
		const statusMap = {
			pending: { label: "Pendente", variant: "secondary" as const },
			processing: { label: "Processando", variant: "default" as const },
			shipped: { label: "Enviado", variant: "default" as const },
			delivered: { label: "Entregue", variant: "default" as const },
			cancelled: { label: "Cancelado", variant: "destructive" as const },
			returned: { label: "Devolvido", variant: "secondary" as const },
		};

		if (!status) return <Badge variant="secondary">—</Badge>;
		const statusInfo = statusMap[status];
		return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
	};

	const getPaymentStatusBadge = (
		status?: OrderWithDetails["paymentStatus"],
	) => {
		const statusMap = {
			pending: { label: "Pendente", variant: "secondary" as const },
			paid: { label: "Pago", variant: "default" as const },
			failed: { label: "Falhou", variant: "destructive" as const },
		};

		if (!status) return <Badge variant="secondary">—</Badge>;
		const statusInfo = statusMap[status];
		return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
	};

	const formatCurrency = (cents: number) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(cents / 100);
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("pt-BR").format(date);
	};

	return (
		<>
			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Cliente</TableHead>
								<TableHead>Entrega</TableHead>
								<TableHead>Pagamento</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Produtos</TableHead>
								<TableHead>Data</TableHead>
								<TableHead className="w-[100px]">Ações</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map((order) => (
								<TableRow
									key={order.id}
									className="cursor-pointer hover:bg-muted/50"
									onClick={() => handleEditOrder(order)}
								>
									<TableCell className="font-mono text-sm text-muted-foreground">
										{order.id}
									</TableCell>
									<TableCell className="font-medium">
										{order.customerName}
									</TableCell>
									<TableCell>
										{getDeliveryStatusBadge(order.deliveryStatus)}
									</TableCell>
									<TableCell>
										{getPaymentStatusBadge(order.paymentStatus)}
									</TableCell>
									<TableCell className="font-medium">
										{formatCurrency(0)}{" "}
										{/* TODO: Calculate from orderPayment */}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{order.productCount} produto
										{order.productCount !== 1 ? "s" : ""}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{formatDate(order.createdAt)}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="h-8 w-8 p-0"
													onClick={(e) => e.stopPropagation()}
												>
													<span className="sr-only">Abrir menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Ações</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleEditOrder(order);
													}}
													className="cursor-pointer"
												>
													<Edit className="mr-2 h-4 w-4" />
													Editar
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteOrder(order);
													}}
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
				</CardContent>
			</Card>

			{editingOrder && (
				<Drawer
					trigger={null}
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
				itemName={deletingOrder?.id || ""}
				itemType="pedido"
				onConfirm={confirmDeleteOrder}
				isLoading={isDeleting}
			/>
		</>
	);
}
