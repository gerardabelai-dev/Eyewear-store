import { Layers, Package, Tags } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getCategoriesWithCountsQuery } from "@/lib/queries/categories";

export async function CategoriesStatistics() {
	const categories = await getCategoriesWithCountsQuery();

	// Calculate statistics
	const totalCategories = (categories || []).length;
	type CategoryWithCounts = {
		productsCount: number;
		subcategoriesCount: number;
	};
	const totalSubcategories = (categories || []).reduce(
		(acc, cat: CategoryWithCounts) => acc + cat.subcategoriesCount,
		0,
	);
	const totalProducts = (categories || []).reduce(
		(acc, cat: CategoryWithCounts) => acc + cat.productsCount,
		0,
	);
	const categoriesWithProducts = (categories || []).filter(
		(cat: CategoryWithCounts) => cat.productsCount > 0,
	).length;
	const averageProducts = totalProducts / categoriesWithProducts;

	return (
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
					<CardTitle className="text-sm font-medium">
						Produtos Vinculados
					</CardTitle>
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
					<CardTitle className="text-sm font-medium">
						Categorias Ativas
					</CardTitle>
					<Layers className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{categoriesWithProducts}</div>
					<p className="text-xs text-muted-foreground">com produtos</p>
				</CardContent>
			</Card>
		</div>
	);
}
