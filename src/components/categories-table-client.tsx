import { CategoriesTableWrapper } from "@/components/categories-table-wrapper";

export function CategoriesTableClient() {
	// Mock categories data
	const categories = [
		{
			id: "1",
			name: "Eletrônicos",
			slug: "eletronicos",
			description: "Produtos eletrônicos e gadgets",
			productsCount: 15,
			subcategoriesCount: 3,
			createdAt: new Date("2024-01-15"),
			updatedAt: new Date("2024-01-15"),
		},
		{
			id: "2",
			name: "Roupas",
			slug: "roupas",
			description: "Vestuário masculino e feminino",
			productsCount: 25,
			subcategoriesCount: 5,
			createdAt: new Date("2024-01-10"),
			updatedAt: new Date("2024-01-10"),
		},
		{
			id: "3",
			name: "Casa e Decoração",
			slug: "casa-decoracao",
			description: "Móveis e itens de decoração",
			productsCount: 10,
			subcategoriesCount: 4,
			createdAt: new Date("2024-01-05"),
			updatedAt: new Date("2024-01-05"),
		},
	];

	return <CategoriesTableWrapper categories={categories} />;
}
