"use client";

import { Plus, ShoppingCart } from "lucide-react";
import { OrderForm } from "@/components/forms/order-form";
import { Button } from "@/components/ui/button";
import { DrawerControlled } from "@/components/ui/drawer";

export function OrderCreationSheet() {
	return (
		<DrawerControlled
			trigger={
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Novo Pedido
				</Button>
			}
			title="Novo Pedido"
			description="Preencha os dados do cliente e adicione os produtos desejados"
			icon={<ShoppingCart className="h-5 w-5" />}
		>
			{({ onClose }) => (
				<OrderForm
					onSuccess={() => {
						// Close the sheet after successful creation
						onClose();
					}}
				/>
			)}
		</DrawerControlled>
	);
}
