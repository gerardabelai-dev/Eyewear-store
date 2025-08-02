"use client";

import { Edit, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
	CategoriesTable,
	type CategoryWithCounts,
} from "@/components/categories-table";
import { CategoryForm } from "@/components/forms/category-form";
import { CategoryDeleteDialog } from "@/components/ui/category-delete-dialog";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

interface CategoriesTableWrapperProps {
	categories: CategoryWithCounts[];
	onRefresh?: () => void;
}

export function CategoriesTableWrapper({
	categories,
	onRefresh,
}: CategoriesTableWrapperProps) {
	const router = useRouter();
	const [editingCategory, setEditingCategory] =
		useState<CategoryWithCounts | null>(null);
	const [deletingCategory, setDeletingCategory] =
		useState<CategoryWithCounts | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Filter categories based on search query
	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleRefresh = () => {
		if (onRefresh) {
			onRefresh();
		} else {
			router.refresh();
		}
	};

	const handleEditCategory = (category: CategoryWithCounts) => {
		setEditingCategory(category);
	};

	const handleDeleteCategory = async (category: CategoryWithCounts) => {
		setDeletingCategory(category);
	};

	const confirmDeleteCategory = async () => {
		if (!deletingCategory) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/categories/${deletingCategory.id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Erro ao excluir categoria");
			}

			toast.success("Categoria excluída com sucesso!");
			setDeletingCategory(null);
			handleRefresh();
		} catch (error: any) {
			toast.error(error.message || "Erro ao excluir categoria");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleSuccess = () => {
		setEditingCategory(null);
		handleRefresh();
	};

	return (
		<>
			{/* Search */}
			<div className="mb-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Buscar categorias..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
			</div>

			<CategoriesTable
				categories={filteredCategories}
				onEditCategory={handleEditCategory}
				onDeleteCategory={handleDeleteCategory}
			/>

			{/* Edit Category Drawer */}
			<Drawer
				trigger={<div style={{ display: "none" }} />}
				title="Editar Categoria"
				description="Altere os dados da categoria, gerencie subcategorias e visualize produtos relacionados."
				icon={<Edit className="h-5 w-5" />}
				open={!!editingCategory}
				onOpenChange={(open) => {
					if (!open) setEditingCategory(null);
				}}
			>
				{editingCategory && (
					<CategoryForm category={editingCategory} onSuccess={handleSuccess} />
				)}
			</Drawer>

			{/* Delete Category Dialog */}
			<CategoryDeleteDialog
				open={!!deletingCategory}
				onOpenChange={(open) => {
					if (!open) setDeletingCategory(null);
				}}
				categoryId={deletingCategory?.id}
				itemName={deletingCategory?.name || ""}
				itemType="categoria"
				onConfirm={confirmDeleteCategory}
				isLoading={isDeleting}
			/>
		</>
	);
}
