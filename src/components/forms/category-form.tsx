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
import { createCategory, updateCategory } from "@/lib/actions/category";
import type { Category } from "@/lib/db/schema";

const categoryFormSchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
	description: z
		.string()
		.max(500, "Descrição deve ter no máximo 500 caracteres")
		.optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
	onSuccess?: () => void;
	category?: Category; // For edit mode
}

export function CategoryForm({ onSuccess, category }: CategoryFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isEditing = !!category;

	const form = useForm<CategoryFormData>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: {
			name: category?.name || "",
			description: category?.description || "",
		},
	});

	async function onSubmit(data: CategoryFormData) {
		setIsSubmitting(true);
		try {
			let result: { error?: string; success?: string };

			if (isEditing) {
				result = await updateCategory({ ...data, id: category.id });
			} else {
				result = await createCategory(data);
			}

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(
					result.success ||
						(isEditing
							? "Categoria atualizada com sucesso!"
							: "Categoria criada com sucesso!"),
				);
				if (!isEditing) {
					form.reset();
				}
				onSuccess?.();
			}
		} catch (error) {
			console.error(
				`Erro ao ${isEditing ? "atualizar" : "criar"} categoria:`,
				error,
			);
			toast.error("Erro ao salvar categoria");
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
				className="space-y-4"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome da Categoria *</FormLabel>
							<FormControl>
								<Input placeholder="Ex: Óculos de Grau" {...field} />
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
									placeholder="Descrição da categoria..."
									className="min-h-[100px]"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isSubmitting} className="w-full">
					{isSubmitting
						? isEditing
							? "Atualizando categoria..."
							: "Criando categoria..."
						: isEditing
							? "Atualizar Categoria"
							: "Criar Categoria"}
				</Button>
			</form>
		</Form>
	);
}
