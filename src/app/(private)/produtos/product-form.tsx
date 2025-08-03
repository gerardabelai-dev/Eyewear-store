"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const productFormSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
	product?: {
		id: string;
		name: string;
	};
	onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productFormSchema),
		defaultValues: {
			name: product?.name || "",
		},
	});

	const onSubmit = async (_values: ProductFormValues) => {
		setIsSubmitting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 3000));

		toast.success(
			product
				? "Produto atualizado com sucesso!"
				: "Produto criado com sucesso!",
		);
		setIsSubmitting(false);
		form.reset();
		onSuccess?.();
	};

	const handleDelete = async () => {
		if (!product) return;
		setIsSubmitting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 3000));
		toast.success("Produto excluído com sucesso!");
		setIsSubmitting(false);
		onSuccess?.();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{product ? "Editar Produto" : "Criar Produto"}</CardTitle>
			</CardHeader>
			<CardContent>
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

						<div className="flex gap-2">
							<Button type="submit" disabled={isSubmitting} className="w-full">
								{isSubmitting
									? "Salvando..."
									: product
										? "Atualizar Produto"
										: "Criar Produto"}
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
			</CardContent>
		</Card>
	);
}
