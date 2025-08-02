import { ProductsTableWrapper } from "@/components/products-table-wrapper";

export function ProductsTableClient() {
	// Mock products data
	const products = [
		{
			id: "1",
			name: "Notebook Dell Inspiron",
			description: "Notebook com processador Intel Core i5",
			price: "3599.90",
			stock: 12,
			status: "active" as const,
			images: ["https://via.placeholder.com/150"],
			categoryId: "1",
			categoryName: "Eletrônicos",
			categorySlug: "eletronicos",
			subcategoryId: "1",
			subcategoryName: "Notebooks",
			subcategorySlug: "notebooks",
			createdAt: new Date("2024-01-20"),
			updatedAt: new Date("2024-01-20"),
		},
		{
			id: "2",
			name: "Camiseta Básica Preta",
			description: "Camiseta 100% algodão",
			price: "49.90",
			stock: 50,
			status: "active" as const,
			images: ["https://via.placeholder.com/150"],
			categoryId: "2",
			categoryName: "Roupas",
			categorySlug: "roupas",
			subcategoryId: "2",
			subcategoryName: "Camisetas",
			subcategorySlug: "camisetas",
			createdAt: new Date("2024-01-18"),
			updatedAt: new Date("2024-01-18"),
		},
		{
			id: "3",
			name: "Sofá 3 Lugares",
			description: "Sofá confortável para sala de estar",
			price: "1899.00",
			stock: 3,
			status: "active" as const,
			images: ["https://via.placeholder.com/150"],
			categoryId: "3",
			categoryName: "Casa e Decoração",
			categorySlug: "casa-decoracao",
			subcategoryId: "3",
			subcategoryName: "Móveis",
			subcategorySlug: "moveis",
			createdAt: new Date("2024-01-15"),
			updatedAt: new Date("2024-01-15"),
		},
	];

	return <ProductsTableWrapper products={products} />;
}
