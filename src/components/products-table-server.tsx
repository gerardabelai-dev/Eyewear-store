import { ProductsTableWrapper } from "@/components/products-table-wrapper";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getProducts } from "@/lib/actions/product";

export async function ProductsTableServer() {
	const result = await getProducts();

	if (result.error) {
		console.error("Error loading products:", result.error);
	}

	const products = result.data || [];
	const totalProducts = products.length;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Produtos Cadastrados</CardTitle>
				<CardDescription>
					{totalProducts > 0
						? `${totalProducts} produto${
								totalProducts > 1 ? "s" : ""
							} encontrado${totalProducts > 1 ? "s" : ""}`
						: "Nenhum produto cadastrado ainda"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ProductsTableWrapper products={products} />
			</CardContent>
		</Card>
	);
}
