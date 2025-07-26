import { AlertTriangle, Package, Package2, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { ProductCreationSheet } from "@/components/product-creation-sheet";
import { ProductsTableWrapper } from "@/components/products-table-wrapper";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getProducts } from "@/lib/actions/product";
import { getSession } from "@/lib/auth-server";

// Force dynamic rendering for authenticated pages
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
	const result = await getProducts();
	if (result.error) {
		redirect("/account");
	}

	const products = result.data || [];

	// Calculate statistics
	const totalProducts = products.length;
	const inStock = products.filter((p) => p.stock > 10).length;
	const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
	const outOfStock = products.filter((p) => p.stock === 0).length;

	return (
		<>
			{/* Page Header */}
			<PageHeader
				title="Produtos"
				description="Gerencie seus produtos e estoque"
				action={<ProductCreationSheet />}
			/>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total de Produtos
						</CardTitle>
						<Package2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalProducts}</div>
						<p className="text-xs text-muted-foreground">
							produtos cadastrados
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Em Estoque</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{inStock}</div>
						<p className="text-xs text-muted-foreground">
							com estoque adequado
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{lowStock}</div>
						<p className="text-xs text-muted-foreground">
							precisam de reposição
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{outOfStock}</div>
						<p className="text-xs text-muted-foreground">produtos esgotados</p>
					</CardContent>
				</Card>
			</div>

			{/* Products Table */}
			<Card>
				<CardHeader>
					<CardTitle>Produtos Cadastrados</CardTitle>
					<CardDescription>
						{totalProducts > 0
							? `${totalProducts} produto${totalProducts > 1 ? "s" : ""} encontrado${totalProducts > 1 ? "s" : ""}`
							: "Nenhum produto cadastrado ainda"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProductsTableWrapper products={products} />
				</CardContent>
			</Card>
		</>
	);
}
