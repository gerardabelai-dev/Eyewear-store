"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	createOrderStatus,
	updateOrderStatus,
} from "@/lib/actions/order-status";
import type { OrderStatus } from "@/lib/db/schema";

const orderStatusFormSchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
	description: z
		.string()
		.max(500, "Descrição deve ter no máximo 500 caracteres")
		.optional(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i, "Cor deve ser um código hexadecimal válido")
		.optional()
		.default("#6b7280"),
	icon: z
		.string()
		.max(50, "Ícone deve ter no máximo 50 caracteres")
		.optional()
		.default("Package"),
	isDefault: z.boolean().optional().default(false),
	isActive: z.boolean().optional().default(true),
	sortOrder: z.number().int().min(0).optional().default(0),
});

type OrderStatusFormData = z.infer<typeof orderStatusFormSchema>;

interface OrderStatusFormProps {
	onSuccess?: () => void;
	orderStatus?: OrderStatus; // For edit mode
}

export function OrderStatusForm({
	onSuccess,
	orderStatus,
}: OrderStatusFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isEditing = !!orderStatus;

	const form = useForm({
		resolver: zodResolver(orderStatusFormSchema),
		defaultValues: {
			name: orderStatus?.name || "",
			description: orderStatus?.description || "",
			color: orderStatus?.color || "#6b7280",
			icon: orderStatus?.icon || "Package",
			isDefault: orderStatus?.isDefault ?? false,
			isActive: orderStatus?.isActive ?? true,
			sortOrder: orderStatus?.sortOrder || 0,
		},
	});

	async function onSubmit(data: OrderStatusFormData) {
		setIsSubmitting(true);
		try {
			let result: { error?: string; success?: string };

			if (isEditing) {
				result = await updateOrderStatus({ ...data, id: orderStatus.id });
			} else {
				result = await createOrderStatus(data);
			}

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(
					result.success ||
						(isEditing
							? "Status atualizado com sucesso!"
							: "Status criado com sucesso!"),
				);
				if (!isEditing) {
					form.reset();
				}
				onSuccess?.();
			}
		} catch (error) {
			console.error(
				`Erro ao ${isEditing ? "atualizar" : "criar"} status:`,
				error,
			);
			toast.error("Erro ao salvar status");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit, (errors) => {
					console.error("Form validation errors:", errors);
					toast.error(
						"Por favor, verifique os campos destacados e tente novamente.",
					);
				})}
				className="space-y-6"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome do Status *</FormLabel>
							<FormControl>
								<Input placeholder="Ex: Em Processamento" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descrição</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									value={field.value || ""}
									placeholder="Descrição do status..."
									className="min-h-[100px]"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="space-y-6">
					<FormField
						control={form.control}
						name="color"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cor</FormLabel>
								<FormControl>
									<div className="flex items-center gap-2">
										<Input
											type="color"
											{...field}
											className="w-12 h-10 p-1 border rounded"
										/>
										<Input
											type="text"
											{...field}
											placeholder="#6b7280"
											className="flex-1"
										/>
									</div>
								</FormControl>
								<FormDescription>
									Cor hexadecimal para exibição na interface
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="icon"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ícone</FormLabel>
								<FormControl>
									<Input placeholder="Package" className="w-full" {...field} />
								</FormControl>
								<FormDescription>Nome do ícone Lucide React</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="sortOrder"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ordem de Exibição</FormLabel>
							<FormControl>
								<Input
									type="number"
									min="0"
									{...field}
									onChange={(e) =>
										field.onChange(parseInt(e.target.value) || 0)
									}
									placeholder="0"
								/>
							</FormControl>
							<FormDescription>
								Número para ordenação (menor = primeiro)
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="space-y-4">
					<FormField
						control={form.control}
						name="isDefault"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Status Padrão</FormLabel>
									<FormDescription>
										Este status será usado para novos pedidos
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="isActive"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Status Ativo</FormLabel>
									<FormDescription>
										Status inativos não aparecem nas opções
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit" disabled={isSubmitting} className="w-full">
					{isSubmitting
						? isEditing
							? "Atualizando status..."
							: "Criando status..."
						: isEditing
							? "Atualizar Status"
							: "Criar Status"}
				</Button>
			</form>
		</Form>
	);
}
