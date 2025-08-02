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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const productFormSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	description: z.string().optional(),
	price: z.number().min(0, "Preço deve ser positivo"),
	status: z.enum(["active", "inactive"]),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
	product?: {
		id: string;
		name: string;
		description?: string;
		price: string; // Changed to string to match ProductWithCategory
		status: "active" | "inactive";
	};
	onSuccess?: () => void;
}

export function ProductFormSimple({ product, onSuccess }: ProductFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productFormSchema),
		defaultValues: {
			name: product?.name || "",
			description: product?.description || "",
			price: product?.price ? parseFloat(product.price) : 0,
			status: product?.status || "active",
		},
	});

	const onSubmit = async (_values: ProductFormValues) => {
		setIsSubmitting(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 3000));

			toast.success(
				product
					? "Produto atualizado com sucesso!"
					: "Produto criado com sucesso!",
			);

			form.reset();
			onSuccess?.();
		} catch (_error) {
			toast.error("Erro ao salvar produto");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!product) return;

		setIsSubmitting(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 3000));

			toast.success("Produto excluído com sucesso!");
			onSuccess?.();
		} catch (_error) {
			toast.error("Erro ao excluir produto");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder="Nome do produto" {...field} />
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
								<Textarea placeholder="Descrição do produto" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Preço</FormLabel>
							<FormControl>
								<Input
									type="number"
									step="0.01"
									placeholder="0.00"
									{...field}
									onChange={(e) => field.onChange(parseFloat(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-2">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Salvando..." : product ? "Atualizar" : "Criar"}
					</Button>

					{product && (
						<Button
							type="button"
							variant="destructive"
							onClick={handleDelete}
							disabled={isSubmitting}
						>
							{isSubmitting ? "Excluindo..." : "Excluir"}
						</Button>
					)}
				</div>
			</form>
		</Form>
	);
}
