"use client";

import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductFormSimple } from "@/components/forms/product-form-simple";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Product } from "@/lib/types";

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
			<div className="rounded-md border">
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
							<TableRow key={product.id}>
								<TableCell className="font-medium">{product.name}</TableCell>
								<TableCell>{product.categoryName}</TableCell>
								<TableCell>{formatCurrency(product.price)}</TableCell>
								<TableCell>{product.stock}</TableCell>
								<TableCell>{getStatusBadge(product.status)}</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleEditProduct(product)}
									>
										<Edit className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

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
				<ProductFormSimple
					product={editingProduct || undefined}
					onSuccess={() => {
						setIsEditDrawerOpen(false);
						setEditingProduct(null);
						toast.success("Produto atualizado com sucesso!");
					}}
				/>
			</Drawer>
		</>
	);
}
