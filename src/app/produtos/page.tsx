import {
	AlertTriangle,
	Package,
	Package2,
	Search,
	TrendingUp,
} from "lucide-react";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { ProductCreationSheet } from "@/components/product-creation-sheet";
import { ProductsTable } from "@/components/products-table";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/actions/product";
import { getUserProfile } from "@/lib/actions/user";
import { getCurrentUser } from "@/lib/auth-server";

export default async function ProdutosPage() {
	const user = await getCurrentUser();
	if (!user) {
		redirect("/auth");
	}

	// Load user profile for header
	const userResult = await getUserProfile();
	if (userResult.error || !userResult.data) {
		redirect("/auth");
	}

	const result = await getProducts();
	if (result.error) {
		redirect("/dashboard");
	}

	const userProfile = userResult.data;
	const products = result.data || [];

	// Calculate statistics
	const totalProducts = products.length;
	const inStock = products.filter((p) => p.stock > 10).length;
	const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
	const outOfStock = products.filter((p) => p.stock === 0).length;

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userInitials = getInitials(
		`${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() ||
			"User",
	);

	const userName =
		`${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() ||
		"Usuário";

	return (
		<div className="flex flex-col">
			<DashboardHeader
				userImage={userProfile.image}
				userInitials={userInitials}
				userName={userName}
				userEmail={userProfile.email}
			/>

			<main className="flex-1 space-y-6 p-6">
				{/* Page Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
						<p className="text-muted-foreground">
							Gerencie seus produtos e estoque
						</p>
					</div>
					<ProductCreationSheet />
				</div>

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
							<TrendingUp className="h-4 w-4 text-green-600" />
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
							<CardTitle className="text-sm font-medium">
								Estoque Baixo
							</CardTitle>
							<AlertTriangle className="h-4 w-4 text-yellow-600" />
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
							<Package className="h-4 w-4 text-red-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{outOfStock}</div>
							<p className="text-xs text-muted-foreground">
								produtos esgotados
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Search and Filters */}
				<Card>
					<CardHeader>
						<CardTitle>Buscar Produtos</CardTitle>
						<CardDescription>
							Encontre rapidamente seus produtos usando filtros
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-col gap-4 sm:flex-row">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Buscar por nome ou descrição..."
									className="pl-9"
								/>
							</div>
							<div className="flex gap-2">
								<Badge variant="secondary" className="whitespace-nowrap">
									Todos os produtos
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

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
						<ProductsTable products={products} />
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
