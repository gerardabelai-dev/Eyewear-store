"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from "@/lib/db/schema";

interface OrderFormProps {
	onSuccess?: () => void;
	order?: Order;
}

export function OrderForm({ onSuccess, order }: OrderFormProps) {
	const isEditing = !!order;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{isEditing ? "Editar Pedido" : "Criar Pedido"}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<p className="text-muted-foreground">
						Formulário de pedidos temporariamente indisponível durante a
						migração do sistema.
					</p>
					<Button onClick={onSuccess} className="w-full">
						Fechar
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
