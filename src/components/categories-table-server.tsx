import { CategoriesTableWrapper } from "@/components/categories-table-wrapper";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getCategoriesWithCounts } from "@/lib/actions/category";

export async function CategoriesTableServer() {
	const result = await getCategoriesWithCounts();
	const categories = result.data || [];
	const totalCategories = categories.length;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Categorias Cadastradas</CardTitle>
				<CardDescription>
					{totalCategories > 0
						? `${totalCategories} categoria${
								totalCategories > 1 ? "s" : ""
							} encontrada${totalCategories > 1 ? "s" : ""}`
						: "Nenhuma categoria cadastrada ainda"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<CategoriesTableWrapper categories={categories} />
			</CardContent>
		</Card>
	);
}
