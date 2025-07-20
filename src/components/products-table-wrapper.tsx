"use client";

import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductForm } from "@/components/forms/product-form";
import { ProductsAdvancedTable } from "@/components/products-advanced-table";
import { Drawer } from "@/components/ui/drawer";
import { deleteProduct } from "@/lib/actions/product";
import type { Product } from "@/lib/db/schema";

// Extended Product type with category information
type ProductWithCategory = Product & {
	categoryName: string | null;
	categorySlug: string | null;
	subcategoryName: string | null;
	subcategorySlug: string | null;
};

interface ProductsTableWrapperProps {
	products: ProductWithCategory[];
}

export function ProductsTableWrapper({ products }: ProductsTableWrapperProps) {
	const [editingProduct, setEditingProduct] =
		useState<ProductWithCategory | null>(null);
	const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

	const handleEditProduct = (product: ProductWithCategory) => {
		setEditingProduct(product);
		setIsEditDrawerOpen(true);
	};

	const handleDeleteProduct = async (product: ProductWithCategory) => {
		try {
			const result = await deleteProduct(product.id);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Produto excluído com sucesso!");
				// Refresh the page to show updated data
				window.location.reload();
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			toast.error("Erro ao excluir produto");
		}
	};

	const handleEditSuccess = () => {
		setIsEditDrawerOpen(false);
		setEditingProduct(null);
		// Refresh the page to show updated data
		window.location.reload();
	};

	const handleEditCancel = () => {
		setIsEditDrawerOpen(false);
		setEditingProduct(null);
	};

	return (
		<>
			<ProductsAdvancedTable
				products={products}
				onEditProduct={handleEditProduct}
				onDeleteProduct={handleDeleteProduct}
			/>

			{/* Edit Product Drawer */}
			<Drawer
				open={isEditDrawerOpen}
				onOpenChange={(open: boolean) => {
					if (!open) {
						handleEditCancel();
					}
				}}
				trigger={<div style={{ display: "none" }} />}
				title="Editar Produto"
				description="Atualize as informações do produto"
				icon={<Edit className="h-5 w-5" />}
			>
				<ProductForm
					product={editingProduct || undefined}
					onSuccess={handleEditSuccess}
				/>
			</Drawer>
		</>
	);
}
