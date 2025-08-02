"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, ImageOff, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryDeleteDialog } from "@/components/ui/category-delete-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { GenericDeleteDialog } from "@/components/ui/generic-delete-dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
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

const subcategoryFormSchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;
type SubcategoryFormData = z.infer<typeof subcategoryFormSchema>;

type SubcategoryWithCount = {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	categoryId: string;
	createdAt: Date;
	updatedAt: Date;
	productsCount: number;
};

type ProductInCategory = {
	id: string;
	name: string;
	price: string;
	stock: number;
	status: string;
	images: string[] | null;
	subcategoryId: string | null;
	subcategoryName: string | null;
};

interface CategoryEditFormProps {
	onSuccess?: () => void;
	category: Category;
}

export function CategoryEditForm({
	onSuccess,
	category,
}: CategoryEditFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [subcategories, setSubcategories] = useState<SubcategoryWithCount[]>(
		[],
	);
	const [products, setProducts] = useState<ProductInCategory[]>([]);
	const [editingSubcategory, setEditingSubcategory] =
		useState<SubcategoryWithCount | null>(null);
	const [deletingSubcategory, setDeletingSubcategory] =
		useState<SubcategoryWithCount | null>(null);
	const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
	const [newSubcategoryName, setNewSubcategoryName] = useState("");
	const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] =
		useState(false);
	const [isDeletingCat, setIsDeletingCat] = useState(false);

	const form = useForm<CategoryFormData>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: {
			name: category.name,
			description: category.description || "",
		},
	});

	const subcategoryForm = useForm<SubcategoryFormData>({
		resolver: zodResolver(subcategoryFormSchema),
		defaultValues: {
			name: "",
		},
	});

	// Load category details
	useEffect(() => {
		loadCategoryDetails();
	}, [category.id]);

	const loadCategoryDetails = async () => {
		setIsLoading(true);
		try {
			const result = await fetch(`/api/categories/details?id=${category.id}`);
			if (result.ok) {
				const data = await result.json();
				setSubcategories(data.subcategories);
				setProducts(data.products);
			} else {
				const error = await result.json();
				toast.error(error.message || "Erro ao carregar detalhes da categoria");
			}
		} catch (error) {
			toast.error("Erro ao carregar detalhes da categoria");
		} finally {
			setIsLoading(false);
		}
	};

	const { mutate: updateCategoryMutation, isPending: isUpdatingCategory } =
		useMutation<unknown, Error, CategoryFormData>({
			mutationFn: async (data) => {
				const result = await fetch(`/api/categories/${category.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				});
				if (!result.ok) {
					const error = await result.json();
					throw new Error(error.message || "Erro ao atualizar categoria");
				}
				return result.json();
			},
			onSuccess: () => {
				toast.success("Categoria atualizada com sucesso!");
				onSuccess?.();
			},
			onError: (error) => {
				toast.error(error.message || "Erro ao atualizar categoria");
			},
		});

	const {
		mutate: createSubcategoryMutation,
		isPending: isCreatingSubcategory,
	} = useMutation({
		mutationFn: async (data: { name: string; categoryId: string }) => {
			const result = await fetch(
				`/api/categories/${category.id}/subcategories`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				},
			);
			if (!result.ok) {
				const error = await result.json();
				throw new Error(error.message || "Erro ao criar subcategoria");
			}
			return result.json();
		},
		onSuccess: () => {
			toast.success("Subcategoria criada com sucesso!");
			setNewSubcategoryName("");
			loadCategoryDetails();
			onSuccess?.(); // Invalidate parent categories table
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao criar subcategoria");
		},
	});

	const {
		mutate: updateSubcategoryMutation,
		isPending: isUpdatingSubcategory,
	} = useMutation({
		mutationFn: async (data: {
			id: string;
			name: string;
			categoryId: string;
		}) => {
			const result = await fetch(`/api/subcategories/${data.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (!result.ok) {
				const error = await result.json();
				throw new Error(error.message || "Erro ao atualizar subcategoria");
			}
			return result.json();
		},
		onSuccess: () => {
			toast.success("Subcategoria atualizada com sucesso!");
			setEditingSubcategory(null);
			subcategoryForm.reset();
			loadCategoryDetails();
			onSuccess?.(); // Invalidate parent categories table
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao atualizar subcategoria");
		},
	});

	const {
		mutate: deleteSubcategoryMutation,
		isPending: isDeletingSubcategory,
	} = useMutation({
		mutationFn: async (id: string) => {
			const result = await fetch(`/api/subcategories/${id}`, {
				method: "DELETE",
			});
			if (!result.ok) {
				const error = await result.json();
				throw new Error(error.message || "Erro ao excluir subcategoria");
			}
			return result.json();
		},
		onSuccess: () => {
			toast.success("Subcategoria excluída com sucesso!");
			setDeletingSubcategory(null);
			loadCategoryDetails();
			onSuccess?.(); // Invalidate parent categories table
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao excluir subcategoria");
		},
	});

	const { mutate: deleteCategoryMutation, isPending: isDeletingCategory } =
		useMutation({
			mutationFn: async (id: string) => {
				const result = await fetch(`/api/categories/${id}`, {
					method: "DELETE",
				});
				if (!result.ok) {
					const error = await result.json();
					throw new Error(error.message || "Erro ao excluir categoria");
				}
				return result.json();
			},
			onSuccess: () => {
				toast.success("Categoria excluída com sucesso!");
				onSuccess?.();
			},
			onError: (error) => {
				console.error("Error deleting category:", error);
				toast.error("Erro ao excluir categoria");
			},
		});

	const formatPrice = (price: string) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(parseFloat(price));
	};

	const onSubmit = (data: CategoryFormData) => updateCategoryMutation(data);

	const onSubcategorySubmit = (data: SubcategoryFormData) => {
		if (!editingSubcategory) return;
		updateSubcategoryMutation({
			id: editingSubcategory.id,
			name: data.name,
			categoryId: category.id,
		});
	};
	// onSubmit={subcategoryForm.handleSubmit(onSubcategorySubmit)}

	return (
		<div className="space-y-6">
			{/* Main Category Form */}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

					<Button
						type="submit"
						disabled={isSubmitting || isUpdatingCategory}
						className="w-full"
					>
						{isSubmitting || isUpdatingCategory ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Atualizando categoria
							</>
						) : (
							"Atualizar Categoria"
						)}
					</Button>

					{/* Delete button for main category */}
					<Separator />
					<div className="pt-2">
						<Button
							type="button"
							variant="destructive"
							className="w-full"
							onClick={() => setShowDeleteCategoryDialog(true)}
							disabled={isSubmitting || isDeletingCategory}
						>
							Deletar Categoria
						</Button>
					</div>
				</form>
			</Form>

			{/* Subcategories Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Subcategorias</h3>
					<Badge variant="secondary">{subcategories.length}</Badge>
				</div>

				{isLoading ? (
					<div className="space-y-2">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				) : (
					<>
						{/* Add new subcategory */}
						<div className="flex gap-2">
							<Input
								placeholder="Nome da nova subcategoria"
								value={newSubcategoryName}
								onChange={(e) => setNewSubcategoryName(e.target.value)}
								disabled={isAddingSubcategory || isCreatingSubcategory}
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										createSubcategoryMutation({
											name: newSubcategoryName,
											categoryId: category.id,
										});
									}
								}}
							/>
							<Button
								onClick={() =>
									createSubcategoryMutation({
										name: newSubcategoryName,
										categoryId: category.id,
									})
								}
								disabled={
									isAddingSubcategory ||
									!newSubcategoryName.trim() ||
									isCreatingSubcategory
								}
								size="icon"
							>
								{isCreatingSubcategory ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Plus className="h-4 w-4" />
								)}
							</Button>
						</div>

						{/* Subcategories list */}
						{subcategories.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">
								Nenhuma subcategoria cadastrada
							</p>
						) : (
							<div className="space-y-2">
								{subcategories.map((subcategory) => (
									<div
										key={subcategory.id}
										className="flex items-center justify-between p-3 border rounded-lg"
									>
										<div className="flex items-center gap-3">
											<span className="font-medium">{subcategory.name}</span>
											<Badge variant="outline" className="text-xs">
												{subcategory.productsCount} produto
												{subcategory.productsCount !== 1 ? "s" : ""}
											</Badge>
										</div>
										<div className="flex items-center gap-2">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												onClick={() => {
													setEditingSubcategory(subcategory);
													subcategoryForm.setValue("name", subcategory.name);
												}}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												onClick={() => setDeletingSubcategory(subcategory)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>

			{/* Products Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Produtos nesta categoria</h3>
					<Badge variant="secondary">{products.length}</Badge>
				</div>

				{isLoading ? (
					<div className="space-y-2">
						<Skeleton className="h-16 w-full" />
						<Skeleton className="h-16 w-full" />
						<Skeleton className="h-16 w-full" />
					</div>
				) : products.length === 0 ? (
					<p className="text-sm text-muted-foreground text-center py-4">
						Nenhum produto usando esta categoria
					</p>
				) : (
					<div className="space-y-2 max-h-64 overflow-y-auto">
						{products.map((product) => (
							<div
								key={product.id}
								className="flex items-center gap-3 p-3 border rounded-lg"
							>
								{/* Product Image */}
								{product.images && product.images.length > 0 ? (
									<div className="relative h-12 w-12 overflow-hidden rounded-md shrink-0">
										<Image
											src={product.images[0]}
											alt={product.name}
											className="h-full w-full object-cover"
											width={48}
											height={48}
										/>
									</div>
								) : (
									<div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted shrink-0">
										<ImageOff className="h-6 w-6 text-muted-foreground" />
									</div>
								)}

								<div className="flex-1 min-w-0">
									<p className="font-medium truncate">{product.name}</p>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<span>{formatPrice(product.price)}</span>
										{product.subcategoryName && (
											<>
												<span>•</span>
												<span>{product.subcategoryName}</span>
											</>
										)}
									</div>
								</div>

								<Badge
									variant={product.stock > 0 ? "default" : "destructive"}
									className="shrink-0"
								>
									{product.stock} em estoque
								</Badge>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Edit Subcategory Dialog */}
			<Dialog
				open={!!editingSubcategory}
				onOpenChange={(open) => {
					if (!open) {
						setEditingSubcategory(null);
						subcategoryForm.reset();
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar Subcategoria</DialogTitle>
						<DialogDescription>
							Altere o nome da subcategoria abaixo.
						</DialogDescription>
					</DialogHeader>
					<Form {...subcategoryForm}>
						<form
							onSubmit={subcategoryForm.handleSubmit(onSubcategorySubmit)}
							className="space-y-4"
						>
							<FormField
								control={subcategoryForm.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome da Subcategoria *</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setEditingSubcategory(null);
										subcategoryForm.reset();
									}}
								>
									Cancelar
								</Button>
								<Button type="submit">Salvar</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Delete Subcategory Dialog */}
			<CategoryDeleteDialog
				open={!!deletingSubcategory}
				onOpenChange={(open) => {
					if (!open) setDeletingSubcategory(null);
				}}
				subcategoryId={deletingSubcategory?.id}
				itemName={deletingSubcategory?.name || ""}
				itemType="subcategoria"
				onConfirm={() =>
					deletingSubcategory &&
					deleteSubcategoryMutation(deletingSubcategory.id)
				}
				isLoading={isDeletingSubcategory}
			/>

			{/* Delete Category Confirmation Dialog */}
			<GenericDeleteDialog
				open={showDeleteCategoryDialog}
				onOpenChange={setShowDeleteCategoryDialog}
				itemId={category.id}
				itemName={category.name}
				itemType="categoria"
				onConfirm={() => deleteCategoryMutation(category.id)}
				isLoading={isDeletingCategory}
				warningText={
					products.length > 0 || subcategories.length > 0
						? `Atenção: ${products.length} produto(s) e ${subcategories.length} subcategoria(s) serão afetados por esta exclusão.`
						: undefined
				}
			/>
		</div>
	);
}
