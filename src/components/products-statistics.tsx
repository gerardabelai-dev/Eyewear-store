import { AlertTriangle, Package, Package2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getProducts } from "@/lib/actions/product";

export async function ProductsStatistics() {
	const result = await getProducts();

	if (result.error) {
		console.error("Error loading products:", result.error);
	}

	const products = result.data || [];

	// Calculate statistics
	const totalProducts = products.length;
	const activeProducts = products.filter((p) => p.status === "active").length;
	const lowStockProducts = products.filter((p) => p.stock <= 10).length;
	const totalValue = products.reduce(
		(acc, p) => acc + parseFloat(p.price) * p.stock,
		0,
	);

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total de Produtos
					</CardTitle>
					<Package className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalProducts}</div>
					<p className="text-xs text-muted-foreground">produtos cadastrados</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
					<Package2 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{activeProducts}</div>
					<p className="text-xs text-muted-foreground">
						disponíveis para venda
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
					<AlertTriangle className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{lowStockProducts}</div>
					{lowStockProducts > 0 && (
						<Badge variant="destructive" className="mt-1">
							Atenção necessária
						</Badge>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Valor em Estoque
					</CardTitle>
					<TrendingUp className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						R${" "}
						{totalValue.toLocaleString("pt-BR", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</div>
					<p className="text-xs text-muted-foreground">valor total estimado</p>
				</CardContent>
			</Card>
		</div>
	);
}
