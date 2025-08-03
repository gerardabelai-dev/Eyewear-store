"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryDeleteDialog } from "@/components/ui/category-delete-dialog";
import { Drawer } from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Category } from "@/lib/db/schema";
import { CategoryForm } from "./category-form";

// Category type with counts
export type CategoryWithCounts = Category & {
	productsCount: number;
	subcategoriesCount: number;
};

// Mock categories data - in a real app this would come from props or server action
const getMockCategories = (): CategoryWithCounts[] => [
	{
		id: "1",
		name: "Eletrônicos",
		slug: "eletronicos",
		description: "Produtos eletrônicos e gadgets",
		createdAt: new Date("2024-01-15"),
		updatedAt: new Date("2024-01-15"),
		productsCount: 15,
		subcategoriesCount: 3,
	},
	{
		id: "2",
		name: "Roupas",
		slug: "roupas",
		description: "Vestuário masculino e feminino",
		createdAt: new Date("2024-01-10"),
		updatedAt: new Date("2024-01-10"),
		productsCount: 25,
		subcategoriesCount: 5,
	},
	{
		id: "3",
		name: "Casa e Decoração",
		slug: "casa-decoracao",
		description: "Móveis e itens de decoração",
		createdAt: new Date("2024-01-05"),
		updatedAt: new Date("2024-01-05"),
		productsCount: 10,
		subcategoriesCount: 4,
	},
];

interface CategoriesTableProps {
	categories?: CategoryWithCounts[];
	onRefresh?: () => void;
}

export function CategoriesTable({
	categories: categoriesProp,
	onRefresh,
}: CategoriesTableProps) {
	const router = useRouter();
	const categories = categoriesProp || getMockCategories();
	const [editingCategory, setEditingCategory] =
		useState<CategoryWithCounts | null>(null);
	const [deletingCategory, setDeletingCategory] =
		useState<CategoryWithCounts | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

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

		// Mock loading delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Mock success (you can simulate error by uncommenting the line below)
		// throw new Error("Simulated API error");

		toast.success("Categoria excluída com sucesso!");
		setDeletingCategory(null);
		setIsDeleting(false);
		handleRefresh();
	};

	const handleSuccess = () => {
		setEditingCategory(null);
		handleRefresh();
	};

	if (categories.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-sm text-muted-foreground">
					Nenhuma categoria encontrada
				</p>
			</div>
		);
	}

	return (
		<>
			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nome</TableHead>
								<TableHead>Descrição</TableHead>
								<TableHead className="text-center">Produtos</TableHead>
								<TableHead className="text-center">Subcategorias</TableHead>
								<TableHead>Criada em</TableHead>
								<TableHead className="text-right">Ações</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{categories.map((category) => (
								<TableRow
									key={category.id}
									className="cursor-pointer hover:bg-muted/50"
									onClick={() => handleEditCategory(category)}
								>
									<TableCell className="font-medium">{category.name}</TableCell>
									<TableCell>
										{category.description || (
											<span className="text-muted-foreground">
												Sem descrição
											</span>
										)}
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="font-mono text-xs">
											{category.productsCount}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="font-mono text-xs">
											{category.subcategoriesCount}
										</Badge>
									</TableCell>
									<TableCell>
										{new Date(category.createdAt).toLocaleDateString("pt-BR")}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="h-8 w-8 p-0"
													onClick={(e) => e.stopPropagation()}
												>
													<span className="sr-only">Abrir menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Ações</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleEditCategory(category);
													}}
													className="cursor-pointer"
												>
													<Edit className="mr-2 h-4 w-4" />
													Editar
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteCategory(category);
													}}
													className="cursor-pointer"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Deletar
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

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
