"use client";

import {
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	Eye,
	Mail,
	MoreHorizontal,
	Package,
	Phone,
	User,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { updateOrderStatus } from "@/lib/actions/order";
import type { Order } from "@/lib/db/schema";

interface OrdersTableProps {
	orders: Order[];
}

interface OrderWithItems extends Order {
	items?: Array<{
		id: string;
		productName: string;
		quantity: number;
		unitPrice: string;
		totalPrice: string;
	}>;
}

export function OrdersTable({ orders }: OrdersTableProps) {
	const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(
		null,
	);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "pending":
				return <Clock className="h-4 w-4" />;
			case "processing":
				return <Package className="h-4 w-4" />;
			case "completed":
				return <CheckCircle className="h-4 w-4" />;
			case "cancelled":
				return <XCircle className="h-4 w-4" />;
			default:
				return <Clock className="h-4 w-4" />;
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return (
					<Badge variant="secondary" className="gap-1">
						<Clock className="h-3 w-3" />
						Pendente
					</Badge>
				);
			case "processing":
				return (
					<Badge
						variant="outline"
						className="gap-1 border-blue-200 text-blue-700"
					>
						<Package className="h-3 w-3" />
						Em Processamento
					</Badge>
				);
			case "completed":
				return (
					<Badge
						variant="outline"
						className="gap-1 border-green-200 text-green-700"
					>
						<CheckCircle className="h-3 w-3" />
						Concluído
					</Badge>
				);
			case "cancelled":
				return (
					<Badge
						variant="outline"
						className="gap-1 border-red-200 text-red-700"
					>
						<XCircle className="h-3 w-3" />
						Cancelado
					</Badge>
				);
			default:
				return (
					<Badge variant="secondary" className="gap-1">
						<Clock className="h-3 w-3" />
						Pendente
					</Badge>
				);
		}
	};

	const handleStatusChange = async (orderId: string, newStatus: string) => {
		setIsUpdatingStatus(true);
		try {
			const result = await updateOrderStatus({
				id: orderId,
				status: newStatus as
					| "pending"
					| "processing"
					| "completed"
					| "cancelled",
			});

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(result.success || "Status atualizado com sucesso");
				// Refresh the page
				window.location.reload();
			}
		} catch (error) {
			console.error("Error updating order status:", error);
			toast.error("Erro ao atualizar status do pedido");
		} finally {
			setIsUpdatingStatus(false);
		}
	};

	const viewOrderDetails = (order: Order) => {
		setSelectedOrder(order);
		setIsDetailsOpen(true);
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(date));
	};

	const formatCurrency = (value: string) => {
		return `R$ ${parseFloat(value).toLocaleString("pt-BR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`;
	};

	if (orders.length === 0) {
		return (
			<div className="text-center py-8">
				<Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
				<p className="text-muted-foreground">
					Quando você criar seu primeiro pedido, ele aparecerá aqui.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Pedido</TableHead>
							<TableHead>Cliente</TableHead>
							<TableHead>Data</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Total</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((order) => (
							<TableRow key={order.id}>
								<TableCell>
									<div className="font-medium">{order.orderNumber}</div>
									<div className="text-sm text-muted-foreground">
										ID: {order.id.slice(-8)}
									</div>
								</TableCell>
								<TableCell>
									<div className="font-medium">{order.customerName}</div>
									<div className="text-sm text-muted-foreground">
										{order.customerEmail}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										{formatDate(order.createdAt)}
									</div>
								</TableCell>
								<TableCell>{getStatusBadge(order.status)}</TableCell>
								<TableCell>
									<div className="font-medium">
										{formatCurrency(order.totalAmount)}
									</div>
								</TableCell>
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
											<DropdownMenuItem onClick={() => viewOrderDetails(order)}>
												<Eye className="mr-2 h-4 w-4" />
												Ver detalhes
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
											{order.status !== "pending" && (
												<DropdownMenuItem
													onClick={() =>
														handleStatusChange(order.id, "pending")
													}
													disabled={isUpdatingStatus}
												>
													<Clock className="mr-2 h-4 w-4" />
													Pendente
												</DropdownMenuItem>
											)}
											{order.status !== "processing" && (
												<DropdownMenuItem
													onClick={() =>
														handleStatusChange(order.id, "processing")
													}
													disabled={isUpdatingStatus}
												>
													<Package className="mr-2 h-4 w-4" />
													Em Processamento
												</DropdownMenuItem>
											)}
											{order.status !== "completed" && (
												<DropdownMenuItem
													onClick={() =>
														handleStatusChange(order.id, "completed")
													}
													disabled={isUpdatingStatus}
												>
													<CheckCircle className="mr-2 h-4 w-4" />
													Concluído
												</DropdownMenuItem>
											)}
											{order.status !== "cancelled" && (
												<DropdownMenuItem
													onClick={() =>
														handleStatusChange(order.id, "cancelled")
													}
													disabled={isUpdatingStatus}
													className="text-red-600"
												>
													<XCircle className="mr-2 h-4 w-4" />
													Cancelado
												</DropdownMenuItem>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Order Details Dialog */}
			<Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
				<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Detalhes do Pedido</DialogTitle>
						<DialogDescription>
							Informações completas sobre o pedido selecionado
						</DialogDescription>
					</DialogHeader>

					{selectedOrder && (
						<div className="space-y-6">
							{/* Order Header */}
							<div className="grid grid-cols-2 gap-4">
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">
											Informações do Pedido
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Número:</span>
											<span className="font-medium">
												{selectedOrder.orderNumber}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Status:</span>
											{getStatusBadge(selectedOrder.status)}
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Total:</span>
											<span className="font-medium text-lg">
												{formatCurrency(selectedOrder.totalAmount)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Data:</span>
											<span>{formatDate(selectedOrder.createdAt)}</span>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="text-lg">
											Informações do Cliente
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-muted-foreground" />
											<span className="font-medium">
												{selectedOrder.customerName}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4 text-muted-foreground" />
											<span>{selectedOrder.customerEmail}</span>
										</div>
										{selectedOrder.customerPhone && (
											<div className="flex items-center gap-2">
												<Phone className="h-4 w-4 text-muted-foreground" />
												<span>{selectedOrder.customerPhone}</span>
											</div>
										)}
									</CardContent>
								</Card>
							</div>

							{/* Notes */}
							{selectedOrder.notes && (
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Observações</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm">{selectedOrder.notes}</p>
									</CardContent>
								</Card>
							)}

							{/* Status Change */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Alterar Status</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-center gap-4">
										<Select
											value={selectedOrder.status}
											onValueChange={(value) =>
												handleStatusChange(selectedOrder.id, value)
											}
											disabled={isUpdatingStatus}
										>
											<SelectTrigger className="w-48">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="pending">Pendente</SelectItem>
												<SelectItem value="processing">
													Em Processamento
												</SelectItem>
												<SelectItem value="completed">Concluído</SelectItem>
												<SelectItem value="cancelled">Cancelado</SelectItem>
											</SelectContent>
										</Select>
										{isUpdatingStatus && (
											<span className="text-sm text-muted-foreground">
												Atualizando...
											</span>
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
