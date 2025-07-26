"use client";

import { Layers, Package, Tags } from "lucide-react";
import { useEffect, useState } from "react";
import type { CategoryWithCounts } from "@/components/categories-table";
import { CategoriesTableWrapper } from "@/components/categories-table-wrapper";
import { CategoryCreationSheet } from "@/components/category-creation-sheet";
import { PageHeader } from "@/components/shared/page-header";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoriesWithCounts } from "@/lib/actions/category";

export default function CategoriesPage() {
	const [categories, setCategories] = useState<CategoryWithCounts[]>([]);
	const [loading, setLoading] = useState(true);

	const loadCategories = async () => {
		setLoading(true);
		try {
			const result = await getCategoriesWithCounts();
			setCategories(result.data || []);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadCategories();
	}, []);

	// Calculate statistics
	const totalCategories = categories.length;
	const totalSubcategories = categories.reduce(
		(acc, cat) => acc + cat.subcategoriesCount,
		0,
	);
	const totalProducts = categories.reduce(
		(acc, cat) => acc + cat.productsCount,
		0,
	);
	const categoriesWithProducts = categories.filter(
		(cat) => cat.productsCount > 0,
	).length;

	if (loading) {
		return (
			<>
				{/* Page Header Skeleton */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<Skeleton className="h-8 w-32" />
							<Skeleton className="h-4 w-96" />
						</div>
						<Skeleton className="h-10 w-40" />
					</div>

					{/* Statistics Cards Skeleton */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{[1, 2, 3, 4].map((i) => (
							<Card key={i}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-4" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-8 w-16 mb-2" />
									<Skeleton className="h-3 w-28" />
								</CardContent>
							</Card>
						))}
					</div>

					{/* Table Skeleton */}
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-4 w-64" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{[1, 2, 3, 4, 5].map((i) => (
									<div
										key={i}
										className="flex items-center justify-between p-4 border rounded-lg"
									>
										<div className="space-y-2">
											<Skeleton className="h-5 w-40" />
											<Skeleton className="h-4 w-24" />
										</div>
										<div className="flex items-center gap-2">
											<Skeleton className="h-6 w-16" />
											<Skeleton className="h-8 w-8" />
											<Skeleton className="h-8 w-8" />
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</>
		);
	}

	return (
		<>
			{/* Page Header */}
			<PageHeader
				title="Categorias"
				description="Gerencie as categorias e subcategorias dos seus produtos"
				action={<CategoryCreationSheet onSuccess={loadCategories} />}
			/>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total de Categorias
						</CardTitle>
						<Layers className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalCategories}</div>
						<p className="text-xs text-muted-foreground">
							categorias cadastradas
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Subcategorias</CardTitle>
						<Tags className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalSubcategories}</div>
						<p className="text-xs text-muted-foreground">
							subcategorias no total
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Produtos</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalProducts}</div>
						<p className="text-xs text-muted-foreground">
							produtos categorizados
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Em Uso</CardTitle>
						<Layers className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{categoriesWithProducts}</div>
						<p className="text-xs text-muted-foreground">
							categorias com produtos
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Categories Table */}
			<Card>
				<CardHeader>
					<CardTitle>Categorias Cadastradas</CardTitle>
					<CardDescription>
						{totalCategories > 0
							? `${totalCategories} categoria${totalCategories > 1 ? "s" : ""} encontrada${totalCategories > 1 ? "s" : ""}`
							: "Nenhuma categoria cadastrada ainda"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CategoriesTableWrapper
						categories={categories}
						onRefresh={loadCategories}
					/>
				</CardContent>
			</Card>
		</>
	);
}
