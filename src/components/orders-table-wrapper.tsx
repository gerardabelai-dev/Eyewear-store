"use client";

import { Edit, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderForm } from "@/components/forms/order-form";
import { OrdersAdvancedTable } from "@/components/orders-advanced-table";
import { Drawer } from "@/components/ui/drawer";
import { getOrderById } from "@/lib/actions/order";
import type { Order, OrderStatus } from "@/lib/db/schema";

interface OrdersTableWrapperProps {
	orders: Order[];
	orderStatuses: OrderStatus[];
}

export function OrdersTableWrapper({
	orders,
	orderStatuses,
}: OrdersTableWrapperProps) {
	const [editingOrder, setEditingOrder] = useState<any>(null);
	const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
	const [isLoadingOrder, setIsLoadingOrder] = useState(false);

	const handleEditOrder = async (order: Order) => {
		setIsLoadingOrder(true);
		try {
			// Fetch complete order data with items
			const result = await getOrderById(order.id);
			if (result.error) {
				toast.error(result.error);
				return;
			}

			setEditingOrder(result.data);
			setIsEditDrawerOpen(true);
		} catch (error) {
			console.error("Error loading order:", error);
			toast.error("Erro ao carregar dados do pedido");
		} finally {
			setIsLoadingOrder(false);
		}
	};

	const handleEditSuccess = () => {
		setIsEditDrawerOpen(false);
		setEditingOrder(null);
		// Refresh the page to show updated data
		window.location.reload();
	};

	const handleEditCancel = () => {
		setIsEditDrawerOpen(false);
		setEditingOrder(null);
	};

	return (
		<>
			<OrdersAdvancedTable
				orders={orders}
				orderStatuses={orderStatuses}
				onEditOrder={handleEditOrder}
			/>

			{/* Edit Order Drawer */}
			<Drawer
				open={isEditDrawerOpen}
				onOpenChange={(open: boolean) => {
					if (!open) {
						handleEditCancel();
					}
				}}
				trigger={<div style={{ display: "none" }} />}
				title="Editar Pedido"
				description="Atualize as informações do pedido e seus produtos"
				icon={<Edit className="h-5 w-5" />}
			>
				<OrderForm
					order={editingOrder || undefined}
					onSuccess={handleEditSuccess}
				/>
			</Drawer>
		</>
	);
}
