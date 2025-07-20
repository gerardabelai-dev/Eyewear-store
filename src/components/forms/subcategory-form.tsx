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
import { createSubcategory, updateSubcategory } from "@/lib/actions/category";
import type { Subcategory } from "@/lib/db/schema";

const subcategoryFormSchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
	categoryId: z.string().min(1, "Categoria é obrigatória"),
	description: z
		.string()
		.max(500, "Descrição deve ter no máximo 500 caracteres")
		.optional(),
});

type SubcategoryFormData = z.infer<typeof subcategoryFormSchema>;

interface SubcategoryFormProps {
	onSuccess?: () => void;
	subcategory?: Subcategory; // For edit mode
	categoryId: string; // Required for new subcategories
}

export function SubcategoryForm({
	onSuccess,
	subcategory,
	categoryId,
}: SubcategoryFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isEditing = !!subcategory;

	const form = useForm<SubcategoryFormData>({
		resolver: zodResolver(subcategoryFormSchema),
		defaultValues: {
			name: subcategory?.name || "",
			categoryId: subcategory?.categoryId || categoryId,
			description: subcategory?.description || "",
		},
	});

	async function onSubmit(data: SubcategoryFormData) {
		setIsSubmitting(true);
		try {
			let result: { error?: string; success?: string };

			if (isEditing) {
				result = await updateSubcategory({ ...data, id: subcategory.id });
			} else {
				result = await createSubcategory(data);
			}

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(
					result.success ||
						(isEditing
							? "Subcategoria atualizada com sucesso!"
							: "Subcategoria criada com sucesso!"),
				);
				if (!isEditing) {
					form.reset({
						name: "",
						categoryId: categoryId,
						description: "",
					});
				}
				onSuccess?.();
			}
		} catch (error) {
			console.error(
				`Erro ao ${isEditing ? "atualizar" : "criar"} subcategoria:`,
				error,
			);
			toast.error("Erro ao salvar subcategoria");
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
							<FormLabel>Nome da Subcategoria *</FormLabel>
							<FormControl>
								<Input placeholder="Ex: Masculino" {...field} />
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
									placeholder="Descrição da subcategoria..."
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
							? "Atualizando subcategoria..."
							: "Criando subcategoria..."
						: isEditing
							? "Atualizar Subcategoria"
							: "Criar Subcategoria"}
				</Button>
			</form>
		</Form>
	);
}
