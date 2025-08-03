"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenericDeleteDialog } from "@/components/ui/generic-delete-dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Product } from "@/lib/db/schema";
import { ProductForm } from "./product-form";

// Extended Product type with category information
type ProductWithCategory = Product & {
	description?: string;
	price?: string;
	images?: string[];
	categoryId?: string;
	subcategoryId?: string;
	categoryName: string | null;
	categorySlug: string | null;
	subcategoryName: string | null;
	subcategorySlug: string | null;
};

// Mock products data - in a real app this would come from props or server action
const getMockProducts = (): ProductWithCategory[] => [
	{
		id: "1",
		name: "Notebook Dell Inspiron",
		stock: 12,
		status: "active" as const,
		createdAt: new Date("2024-01-20"),
		updatedAt: new Date("2024-01-20"),
		description: "Notebook com processador Intel Core i5",
		price: "3599.90",
		images: ["https://via.placeholder.com/150"],
		categoryId: "1",
		categoryName: "Eletrônicos",
		categorySlug: "eletronicos",
		subcategoryId: "1",
		subcategoryName: "Notebooks",
		subcategorySlug: "notebooks",
	},
	{
		id: "2",
		name: "Camiseta Básica Preta",
		stock: 50,
		status: "active" as const,
		createdAt: new Date("2024-01-18"),
		updatedAt: new Date("2024-01-18"),
		description: "Camiseta 100% algodão",
		price: "49.90",
		images: ["https://via.placeholder.com/150"],
		categoryId: "2",
		categoryName: "Roupas",
		categorySlug: "roupas",
		subcategoryId: "2",
		subcategoryName: "Camisetas",
		subcategorySlug: "camisetas",
	},
	{
		id: "3",
		name: "Sofá 3 Lugares",
		stock: 3,
		status: "active" as const,
		createdAt: new Date("2024-01-15"),
		updatedAt: new Date("2024-01-15"),
		description: "Sofá confortável para sala de estar",
		price: "1899.00",
		images: ["https://via.placeholder.com/150"],
		categoryId: "3",
		categoryName: "Casa e Decoração",
		categorySlug: "casa-decoracao",
		subcategoryId: "3",
		subcategoryName: "Móveis",
		subcategorySlug: "moveis",
	},
];

interface ProductsTableProps {
	products?: ProductWithCategory[];
}

export function ProductsTable({ products: productsProp }: ProductsTableProps) {
	const products = productsProp || getMockProducts();
	const [editingProduct, setEditingProduct] =
		useState<ProductWithCategory | null>(null);
	const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
	const [deletingProduct, setDeletingProduct] =
		useState<ProductWithCategory | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleEditProduct = (product: ProductWithCategory) => {
		setEditingProduct(product);
		setIsEditDrawerOpen(true);
	};

	const handleDeleteProduct = (product: ProductWithCategory) => {
		setDeletingProduct(product);
	};

	const confirmDeleteProduct = async () => {
		if (!deletingProduct) return;

		setIsDeleting(true);

		// Mock loading delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Mock success (you can simulate error by uncommenting the line below)
		// throw new Error("Simulated API error");

		toast.success("Produto excluído com sucesso!");
		setDeletingProduct(null);
		setIsDeleting(false);
	};

	const formatCurrency = (value: string) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(parseFloat(value));
	};

	const getStatusBadge = (status: string) => {
		return status === "active" ? (
			<Badge variant="default">Ativo</Badge>
		) : (
			<Badge variant="secondary">Inativo</Badge>
		);
	};

	return (
		<>
			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nome</TableHead>
								<TableHead>Categoria</TableHead>
								<TableHead>Preço</TableHead>
								<TableHead>Estoque</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="w-[100px]">Ações</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{products.map((product) => (
								<TableRow
									key={product.id}
									className="cursor-pointer hover:bg-muted/50"
									onClick={() => handleEditProduct(product)}
								>
									<TableCell className="font-medium">{product.name}</TableCell>
									<TableCell>{product.categoryName}</TableCell>
									<TableCell>{formatCurrency(product.price || "0")}</TableCell>
									<TableCell>{product.stock}</TableCell>
									<TableCell>{getStatusBadge(product.status)}</TableCell>
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
														handleEditProduct(product);
													}}
													className="cursor-pointer"
												>
													<Edit className="mr-2 h-4 w-4" />
													Editar
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteProduct(product);
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

			{/* Edit Product Drawer */}
			<Drawer
				open={isEditDrawerOpen}
				onOpenChange={(open: boolean) => {
					if (!open) {
						setIsEditDrawerOpen(false);
						setEditingProduct(null);
					}
				}}
				trigger={<div style={{ display: "none" }} />}
				title="Editar Produto"
				description="Atualize as informações do produto"
				icon={<Edit className="h-5 w-5" />}
			>
				<ProductForm
					product={editingProduct || undefined}
					onSuccess={() => {
						setIsEditDrawerOpen(false);
						setEditingProduct(null);
						toast.success("Produto atualizado com sucesso!");
					}}
				/>
			</Drawer>

			{/* Delete Product Dialog */}
			<GenericDeleteDialog
				open={!!deletingProduct}
				onOpenChange={(open) => {
					if (!open) setDeletingProduct(null);
				}}
				itemId={deletingProduct?.id || ""}
				itemName={deletingProduct?.name || ""}
				itemType="produto"
				onConfirm={confirmDeleteProduct}
				isLoading={isDeleting}
			/>
		</>
	);
}
