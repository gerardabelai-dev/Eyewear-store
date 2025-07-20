"use client";

import {
	Calendar,
	CheckCircle,
	Clock,
	Package,
	ShoppingCart,
	XCircle,
} from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderForm } from "@/components/forms/order-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrderById } from "@/lib/actions/order";
import type { Order } from "@/lib/db/schema";

interface OrdersTableProps {
	orders: Order[];
}

interface OrderWithItems extends Order {
	items?: Array<{
		id: string;
		productId: string;
		quantity: number;
		unitPrice: string;
		totalPrice: string;
		productName: string;
		productDescription: string;
		productImages: string[];
		categoryName: string;
		subcategoryName: string;
	}>;
}

// Skeleton component for loading state
function OrderFormSkeleton() {
	return (
		<div className="space-y-6 p-6">
			{/* Customer Information Section */}
			<div className="space-y-4">
				<div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
						<div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
					</div>
					<div className="space-y-2">
						<div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
						<div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
					</div>
				</div>
				<div className="space-y-2">
					<div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
					<div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
				</div>
			</div>

			{/* Order Items Section */}
			<div className="space-y-4">
				<div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex items-center justify-between p-3 border rounded"
						>
							<div className="flex-1 space-y-1">
								<div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
								<div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
								<div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Notes Section */}
			<div className="space-y-4">
				<div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
				<div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
			</div>

			{/* Submit Button */}
			<div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
		</div>
	);
}

export function OrdersTable({ orders }: OrdersTableProps) {
	const [editingOrder, setEditingOrder] = useState<OrderWithItems | null>(null);
	const [isLoadingOrderData, setIsLoadingOrderData] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState("all");

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

	const handleEditOrder = async (order: Order) => {
		// Show drawer immediately with skeleton loading
		setEditingOrder({ ...order, items: undefined });
		setIsLoadingOrderData(true);

		try {
			const result = await getOrderById(order.id);
			if (result.error || !result.data) {
				toast.error("Erro ao carregar dados do pedido");
				setEditingOrder(null);
				return;
			}

			// Transform the order data to match the expected format
			const orderWithItems: OrderWithItems = {
				...result.data,
				items: result.data.items.map((item) => ({
					...item,
					productName: item.productName || "Produto sem nome",
					productDescription: item.productDescription || "",
					productImages: item.productImages || [],
					categoryName: item.categoryName || "Sem categoria",
					subcategoryName: item.subcategoryName || "Sem subcategoria",
				})),
			};

			setEditingOrder(orderWithItems);
		} catch (error) {
			console.error("Error loading order:", error);
			toast.error("Erro ao carregar pedido");
			setEditingOrder(null);
		} finally {
			setIsLoadingOrderData(false);
		}
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

	const canEditOrder = (_order: Order) => {
		// For now, allow editing all orders since we don't have direct status access
		// This could be enhanced later when the proper status information is available
		return true;
	};

	const filterOrdersByStatus = (orders: Order[], status: string) => {
		if (status === "all") return orders;
		// For now, return all orders since we don't have direct status filtering
		// This should be enhanced when proper status information is available
		return orders;
	};

	const getOrderCount = (orders: Order[], status: string) => {
		return filterOrdersByStatus(orders, status).length;
	};

	const statusOptions = [
		{ value: "all", label: "Todos", icon: null },
		{ value: "pending", label: "Pendentes", icon: Clock },
		{ value: "processing", label: "Em Processamento", icon: Package },
		{ value: "completed", label: "Concluídos", icon: CheckCircle },
		{ value: "cancelled", label: "Cancelados", icon: XCircle },
	];

	const filteredOrders = filterOrdersByStatus(orders, selectedStatus);

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
			<div className="space-y-4">
				{/* Mobile: Dropdown Filter */}
				<div className="block sm:hidden">
					<Select value={selectedStatus} onValueChange={setSelectedStatus}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Filtrar pedidos por status" />
						</SelectTrigger>
						<SelectContent>
							{statusOptions.map((option) => {
								const Icon = option.icon;
								const count = getOrderCount(orders, option.value);
								return (
									<SelectItem key={option.value} value={option.value}>
										<div className="flex items-center justify-between w-full">
											<div className="flex items-center gap-2">
												{Icon && <Icon className="h-4 w-4" />}
												<span>{option.label}</span>
											</div>
											<Badge variant="secondary" className="text-xs ml-2">
												{count}
											</Badge>
										</div>
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>

				{/* Desktop: Tabs */}
				<div className="hidden sm:block">
					<Tabs
						value={selectedStatus}
						onValueChange={setSelectedStatus}
						className="w-full"
					>
						<TabsList className="grid w-full grid-cols-5">
							<TabsTrigger value="all" className="flex items-center gap-2">
								<span>Todos</span>
								<Badge variant="secondary" className="text-xs">
									{getOrderCount(orders, "all")}
								</Badge>
							</TabsTrigger>
							<TabsTrigger value="pending" className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								<span>Pendentes</span>
								<Badge variant="secondary" className="text-xs">
									{getOrderCount(orders, "pending")}
								</Badge>
							</TabsTrigger>
							<TabsTrigger
								value="processing"
								className="flex items-center gap-2"
							>
								<Package className="h-4 w-4" />
								<span>Em Processamento</span>
								<Badge variant="secondary" className="text-xs">
									{getOrderCount(orders, "processing")}
								</Badge>
							</TabsTrigger>
							<TabsTrigger
								value="completed"
								className="flex items-center gap-2"
							>
								<CheckCircle className="h-4 w-4" />
								<span>Concluídos</span>
								<Badge variant="secondary" className="text-xs">
									{getOrderCount(orders, "completed")}
								</Badge>
							</TabsTrigger>
							<TabsTrigger
								value="cancelled"
								className="flex items-center gap-2"
							>
								<XCircle className="h-4 w-4" />
								<span>Cancelados</span>
								<Badge variant="secondary" className="text-xs">
									{getOrderCount(orders, "cancelled")}
								</Badge>
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{/* Orders Table */}
				<OrderTable
					orders={filteredOrders}
					onEditOrder={handleEditOrder}
					getStatusBadge={getStatusBadge}
					formatDate={formatDate}
					formatCurrency={formatCurrency}
				/>
			</div>

			{/* Edit Order Drawer */}
			{editingOrder && (
				<Drawer
					trigger={<button type="button" style={{ display: "none" }}></button>}
					title={
						canEditOrder(editingOrder) ? "Editar Pedido" : "Detalhes do Pedido"
					}
					description={
						canEditOrder(editingOrder)
							? "Edite as informações do pedido."
							: "Visualize os detalhes do pedido."
					}
					icon={<ShoppingCart className="h-5 w-5" />}
					open={!!editingOrder}
					onOpenChange={(open) => !open && setEditingOrder(null)}
				>
					{isLoadingOrderData ? (
						<OrderFormSkeleton />
					) : (
						<div className="space-y-6">
							{/* Order Form */}
							{canEditOrder(editingOrder) ? (
								<OrderForm
									order={{
										...editingOrder,
										items: editingOrder.items?.map((item) => ({
											productId: item.productId,
											quantity: item.quantity,
											unitPrice: item.unitPrice,
											productName: item.productName,
											productStock: 0, // Will be updated when products are loaded
											productDescription: item.productDescription,
											productImages: item.productImages,
											categoryName: item.categoryName,
											subcategoryName: item.subcategoryName,
										})),
									}}
									onSuccess={() => {
										setEditingOrder(null);
										// The page will be revalidated automatically due to revalidatePath in the action
									}}
								/>
							) : (
								<div className="space-y-4">
									<Card>
										<CardHeader>
											<CardTitle className="text-base">
												Informações do Cliente
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<span className="text-sm font-medium text-muted-foreground">
														Nome:
													</span>
													<p className="font-medium">
														{editingOrder.customerName}
													</p>
												</div>
												<div>
													<span className="text-sm font-medium text-muted-foreground">
														Email:
													</span>
													<p className="font-medium">
														{editingOrder.customerEmail}
													</p>
												</div>
											</div>
											{editingOrder.customerPhone && (
												<div>
													<span className="text-sm font-medium text-muted-foreground">
														Telefone:
													</span>
													<p className="font-medium">
														{editingOrder.customerPhone}
													</p>
												</div>
											)}
										</CardContent>
									</Card>

									{editingOrder.items && editingOrder.items.length > 0 && (
										<Card>
											<CardHeader>
												<CardTitle className="text-base">
													Itens do Pedido
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="space-y-3">
													{editingOrder.items.map((item) => (
														<div
															key={item.id}
															className="flex items-center justify-between p-3 border rounded-lg"
														>
															<div className="flex-1">
																<div className="font-medium">
																	{item.productName}
																</div>
																<div className="text-sm text-muted-foreground">
																	R${" "}
																	{parseFloat(item.unitPrice).toLocaleString(
																		"pt-BR",
																		{
																			minimumFractionDigits: 2,
																		},
																	)}{" "}
																	x {item.quantity}
																</div>
															</div>
															<Badge variant="outline">
																R${" "}
																{parseFloat(item.totalPrice).toLocaleString(
																	"pt-BR",
																	{
																		minimumFractionDigits: 2,
																	},
																)}
															</Badge>
														</div>
													))}
												</div>
												<div className="mt-4 pt-4 border-t">
													<div className="flex justify-between items-center font-bold text-lg">
														<span>Total:</span>
														<span>
															{formatCurrency(editingOrder.totalAmount)}
														</span>
													</div>
												</div>
											</CardContent>
										</Card>
									)}

									{editingOrder.notes && (
										<Card>
											<CardHeader>
												<CardTitle className="text-base">Observações</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm">{editingOrder.notes}</p>
											</CardContent>
										</Card>
									)}
								</div>
							)}
						</div>
					)}
				</Drawer>
			)}
		</>
	);
}

// Extracted OrderTable component for reusability
interface OrderTableProps {
	orders: Order[];
	onEditOrder: (order: Order) => void;
	getStatusBadge: (status: string) => React.ReactElement;
	formatDate: (date: Date) => string;
	formatCurrency: (value: string) => string;
}

function OrderTable({
	orders,
	onEditOrder,
	getStatusBadge,
	formatDate,
	formatCurrency,
}: OrderTableProps) {
	if (orders.length === 0) {
		return (
			<div className="text-center py-8">
				<Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
				<p className="text-muted-foreground">
					Nenhum pedido encontrado para este status.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Pedido</TableHead>
						<TableHead>Cliente</TableHead>
						<TableHead>Data</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Total</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.map((order) => (
						<TableRow
							key={order.id}
							className="cursor-pointer hover:bg-muted/50"
							onClick={() => onEditOrder(order)}
						>
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
							<TableCell>{getStatusBadge("Status")}</TableCell>
							<TableCell>
								<div className="font-medium">
									{formatCurrency(order.totalAmount)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
