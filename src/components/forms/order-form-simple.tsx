"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Order } from "@/lib/types";

interface OrderFormProps {
	onSuccess?: () => void;
	order?: Order;
}

export function OrderForm({ onSuccess, order }: OrderFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isEditing = !!order;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call with 3 second delay
		setTimeout(() => {
			setIsSubmitting(false);
			toast.success(
				isEditing
					? "Pedido atualizado com sucesso!"
					: "Pedido criado com sucesso!",
			);
			if (onSuccess) {
				onSuccess();
			}
		}, 3000);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{isEditing ? "Editar Pedido" : "Criar Pedido"}</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="customer">Cliente</Label>
						<Input
							id="customer"
							placeholder="Nome do cliente"
							defaultValue={order?.customerName}
							required
						/>
					</div>

					<div>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="cliente@email.com"
							defaultValue={order?.customerEmail}
							required
						/>
					</div>

					<div>
						<Label htmlFor="phone">Telefone</Label>
						<Input
							id="phone"
							placeholder="(11) 99999-9999"
							defaultValue={order?.customerPhone}
						/>
					</div>

					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{isEditing ? "Atualizando..." : "Criando..."}
							</>
						) : isEditing ? (
							"Atualizar Pedido"
						) : (
							"Criar Pedido"
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
