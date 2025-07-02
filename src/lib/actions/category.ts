"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { category, subcategory } from "@/lib/db/schema";

// Get all categories with their subcategories
export async function getCategories() {
	try {
		const categories = await db.select().from(category).orderBy(category.name);

		return { data: categories };
	} catch (error) {
		console.error("Erro ao buscar categorias:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Get subcategories for a specific category
export async function getSubcategoriesByCategory(categoryId: string) {
	try {
		const subcategories = await db
			.select()
			.from(subcategory)
			.where(eq(subcategory.categoryId, categoryId))
			.orderBy(subcategory.name);

		return { data: subcategories };
	} catch (error) {
		console.error("Erro ao buscar subcategorias:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Get all subcategories with category info
export async function getAllSubcategoriesWithCategory() {
	try {
		const subcategoriesWithCategory = await db
			.select({
				id: subcategory.id,
				name: subcategory.name,
				slug: subcategory.slug,
				categoryId: subcategory.categoryId,
				categoryName: category.name,
				categorySlug: category.slug,
			})
			.from(subcategory)
			.innerJoin(category, eq(subcategory.categoryId, category.id))
			.orderBy(category.name, subcategory.name);

		return { data: subcategoriesWithCategory };
	} catch (error) {
		console.error("Erro ao buscar subcategorias com categorias:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Create predefined categories and subcategories for glasses ecommerce
export async function seedCategories() {
	try {
		const categoriesData = [
			{
				id: "oculos-grau",
				name: "Óculos de Grau",
				slug: "oculos-grau",
				description: "Óculos para correção visual e uso diário",
			},
			{
				id: "oculos-sol",
				name: "Óculos de Sol",
				slug: "oculos-sol",
				description: "Óculos para proteção solar e estilo",
			},
			{
				id: "lentes-contato",
				name: "Lentes de Contato",
				slug: "lentes-contato",
				description: "Lentes de contato para correção visual",
			},
			{
				id: "armacoes",
				name: "Armações",
				slug: "armacoes",
				description: "Armações para óculos de grau",
			},
			{
				id: "acessorios",
				name: "Acessórios",
				slug: "acessorios",
				description: "Acessórios para óculos e lentes",
			},
			{
				id: "infantil",
				name: "Infantil",
				slug: "infantil",
				description: "Óculos e acessórios para crianças",
			},
		];

		const subcategoriesData = [
			// Óculos de Grau
			{
				id: "grau-masculino",
				name: "Masculino",
				slug: "grau-masculino",
				categoryId: "oculos-grau",
				description: "Óculos de grau para homens",
			},
			{
				id: "grau-feminino",
				name: "Feminino",
				slug: "grau-feminino",
				categoryId: "oculos-grau",
				description: "Óculos de grau para mulheres",
			},
			{
				id: "grau-unissex",
				name: "Unissex",
				slug: "grau-unissex",
				categoryId: "oculos-grau",
				description: "Óculos de grau unissex",
			},
			{
				id: "grau-multifocal",
				name: "Multifocal",
				slug: "grau-multifocal",
				categoryId: "oculos-grau",
				description: "Óculos com lentes multifocais",
			},
			{
				id: "grau-progressivo",
				name: "Progressivo",
				slug: "grau-progressivo",
				categoryId: "oculos-grau",
				description: "Óculos com lentes progressivas",
			},

			// Óculos de Sol
			{
				id: "sol-masculino",
				name: "Masculino",
				slug: "sol-masculino",
				categoryId: "oculos-sol",
				description: "Óculos de sol para homens",
			},
			{
				id: "sol-feminino",
				name: "Feminino",
				slug: "sol-feminino",
				categoryId: "oculos-sol",
				description: "Óculos de sol para mulheres",
			},
			{
				id: "sol-esportivo",
				name: "Esportivo",
				slug: "sol-esportivo",
				categoryId: "oculos-sol",
				description: "Óculos de sol para atividades esportivas",
			},
			{
				id: "sol-aviador",
				name: "Aviador",
				slug: "sol-aviador",
				categoryId: "oculos-sol",
				description: "Óculos estilo aviador",
			},
			{
				id: "sol-wayfarer",
				name: "Wayfarer",
				slug: "sol-wayfarer",
				categoryId: "oculos-sol",
				description: "Óculos estilo wayfarer",
			},
			{
				id: "sol-redondo",
				name: "Redondo",
				slug: "sol-redondo",
				categoryId: "oculos-sol",
				description: "Óculos de sol redondos",
			},

			// Lentes de Contato
			{
				id: "lentes-diarias",
				name: "Lentes Diárias",
				slug: "lentes-diarias",
				categoryId: "lentes-contato",
				description: "Lentes de contato descartáveis diárias",
			},
			{
				id: "lentes-quinzenais",
				name: "Lentes Quinzenais",
				slug: "lentes-quinzenais",
				categoryId: "lentes-contato",
				description: "Lentes de contato quinzenais",
			},
			{
				id: "lentes-mensais",
				name: "Lentes Mensais",
				slug: "lentes-mensais",
				categoryId: "lentes-contato",
				description: "Lentes de contato mensais",
			},
			{
				id: "lentes-coloridas",
				name: "Lentes Coloridas",
				slug: "lentes-coloridas",
				categoryId: "lentes-contato",
				description: "Lentes de contato coloridas",
			},
			{
				id: "lentes-astigmatismo",
				name: "Para Astigmatismo",
				slug: "lentes-astigmatismo",
				categoryId: "lentes-contato",
				description: "Lentes para correção de astigmatismo",
			},

			// Armações
			{
				id: "armacao-metal",
				name: "Metal",
				slug: "armacao-metal",
				categoryId: "armacoes",
				description: "Armações em metal",
			},
			{
				id: "armacao-acetato",
				name: "Acetato",
				slug: "armacao-acetato",
				categoryId: "armacoes",
				description: "Armações em acetato",
			},
			{
				id: "armacao-titanio",
				name: "Titânio",
				slug: "armacao-titanio",
				categoryId: "armacoes",
				description: "Armações em titânio",
			},
			{
				id: "armacao-plastico",
				name: "Plástico",
				slug: "armacao-plastico",
				categoryId: "armacoes",
				description: "Armações em plástico",
			},

			// Acessórios
			{
				id: "estojos",
				name: "Estojos",
				slug: "estojos",
				categoryId: "acessorios",
				description: "Estojos para óculos",
			},
			{
				id: "cordoes",
				name: "Cordões",
				slug: "cordoes",
				categoryId: "acessorios",
				description: "Cordões para óculos",
			},
			{
				id: "produtos-limpeza",
				name: "Produtos de Limpeza",
				slug: "produtos-limpeza",
				categoryId: "acessorios",
				description: "Produtos para limpeza de óculos e lentes",
			},
			{
				id: "suportes",
				name: "Suportes",
				slug: "suportes",
				categoryId: "acessorios",
				description: "Suportes e organizadores para óculos",
			},
			{
				id: "parafusos-pecas",
				name: "Parafusos e Peças",
				slug: "parafusos-pecas",
				categoryId: "acessorios",
				description: "Parafusos e peças de reposição",
			},

			// Infantil
			{
				id: "infantil-grau",
				name: "Óculos de Grau",
				slug: "infantil-grau",
				categoryId: "infantil",
				description: "Óculos de grau para crianças",
			},
			{
				id: "infantil-sol",
				name: "Óculos de Sol",
				slug: "infantil-sol",
				categoryId: "infantil",
				description: "Óculos de sol para crianças",
			},
			{
				id: "infantil-acessorios",
				name: "Acessórios",
				slug: "infantil-acessorios",
				categoryId: "infantil",
				description: "Acessórios para óculos infantis",
			},
		];

		// Insert categories
		await db.insert(category).values(categoriesData).onConflictDoNothing();

		// Insert subcategories
		await db
			.insert(subcategory)
			.values(subcategoriesData)
			.onConflictDoNothing();

		return { success: "Categorias criadas com sucesso" };
	} catch (error) {
		console.error("Erro ao criar categorias:", error);
		return { error: "Erro interno do servidor" };
	}
}
