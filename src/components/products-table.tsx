"use client";

import { Edit, ImageOff, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ProductForm } from "@/components/forms/product-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { Product } from "@/lib/db/schema";

// Extended Product type with category information
type ProductWithCategory = Product & {
	categoryName: string | null;
	categorySlug: string | null;
	subcategoryName: string | null;
	subcategorySlug: string | null;
};

interface ProductsTableProps {
	products: ProductWithCategory[];
}

function getStockStatus(stock: number) {
	if (stock === 0) {
		return { label: "Sem estoque", variant: "destructive" as const };
	}
	if (stock <= 10) {
		return { label: "Estoque baixo", variant: "secondary" as const };
	}
	return { label: "Em estoque", variant: "default" as const };
}

function formatPrice(price: string) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(parseFloat(price));
}

function formatCategory(product: ProductWithCategory) {
	let categoryText = product.categoryName || "Sem categoria";

	if (product.subcategoryName) {
		categoryText += ` > ${product.subcategoryName}`;
	}

	return categoryText;
}

// Product Images Component
function ProductImages({ images }: { images: string[] }) {
	if (!images || images.length === 0) {
		return (
			<div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
				<ImageOff className="h-6 w-6 text-muted-foreground" />
			</div>
		);
	}

	if (images.length === 1) {
		return (
			<div className="relative h-12 w-12 overflow-hidden rounded-md">
				<Image
					src={images[0]}
					alt="Produto"
					className="h-full w-full object-cover"
					width={48}
					height={48}
				/>
			</div>
		);
	}

	return (
		<div className="flex -space-x-2">
			{images.slice(0, 3).map((image, index) => (
				<div
					key={image}
					className="relative h-10 w-10 overflow-hidden rounded-md border-2 border-background"
				>
					<Image
						src={image}
						alt={`Produto ${index + 1}`}
						className="h-full w-full object-cover"
						width={40}
						height={40}
					/>
				</div>
			))}
			{images.length > 3 && (
				<div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-background bg-muted text-xs font-medium">
					+{images.length - 3}
				</div>
			)}
		</div>
	);
}

export function ProductsTable({ products }: ProductsTableProps) {
	const [editingProduct, setEditingProduct] =
		useState<ProductWithCategory | null>(null);

	if (products.length === 0) {
		return (
			<div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
				<p className="text-muted-foreground">Nenhum produto encontrado</p>
			</div>
		);
	}

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Imagem</TableHead>
							<TableHead>Produto</TableHead>
							<TableHead>Categoria</TableHead>
							<TableHead>Preço</TableHead>
							<TableHead>Estoque</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="w-[70px]">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{products.map((product) => {
							const stockStatus = getStockStatus(product.stock);
							return (
								<TableRow
									key={product.id}
									className="cursor-pointer hover:bg-muted/50"
									onClick={() => setEditingProduct(product)}
								>
									<TableCell>
										<ProductImages images={product.images || []} />
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="font-medium max-w-32 whitespace-nowrap overflow-hidden text-ellipsis">
												{product.name}
											</div>
											{product.description && (
												<div className="text-sm text-muted-foreground max-w-32 whitespace-nowrap overflow-hidden text-ellipsis">
													{product.description}
												</div>
											)}
										</div>
									</TableCell>
									<TableCell>{formatCategory(product)}</TableCell>
									<TableCell className="font-medium">
										{formatPrice(product.price)}
									</TableCell>
									<TableCell>{product.stock}</TableCell>
									<TableCell>
										<Badge variant={stockStatus.variant}>
											{stockStatus.label}
										</Badge>
									</TableCell>
									<TableCell onClick={(e) => e.stopPropagation()}>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0">
													<span className="sr-only">Abrir menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Ações</DropdownMenuLabel>
												<DropdownMenuItem
													onClick={() =>
														navigator.clipboard.writeText(product.id)
													}
												>
													Copiar ID do produto
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => setEditingProduct(product)}
												>
													<Edit className="mr-2 h-4 w-4" />
													Editar
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Trash2 className="mr-2 h-4 w-4" />
													Deletar
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{/* Edit Product Drawer */}
			{editingProduct && (
				<Drawer
					trigger={<button type="button" style={{ display: "none" }} />}
					title="Editar Produto"
					description="Atualize as informações do produto. Modifique as imagens para manter seu produto atrativo."
					icon={<Edit className="h-5 w-5" />}
					open={!!editingProduct}
					onOpenChange={(open) => !open && setEditingProduct(null)}
				>
					<ProductForm
						product={editingProduct}
						onSuccess={() => {
							setEditingProduct(null);
							// The page will be revalidated automatically due to revalidatePath in the action
						}}
					/>
				</Drawer>
			)}
		</>
	);
}
