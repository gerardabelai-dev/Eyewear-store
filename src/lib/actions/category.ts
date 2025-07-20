"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { category, subcategory } from "@/lib/db/schema";

// Validation schemas
const categorySchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
	description: z
		.string()
		.max(500, "Descrição deve ter no máximo 500 caracteres")
		.optional(),
});

const subcategorySchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
	categoryId: z.string().min(1, "Categoria é obrigatória"),
	description: z
		.string()
		.max(500, "Descrição deve ter no máximo 500 caracteres")
		.optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;
type SubcategoryFormData = z.infer<typeof subcategorySchema>;

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

// Create a new category
export async function createCategory(data: CategoryFormData) {
	try {
		const validatedData = categorySchema.parse(data);

		// Generate slug from name
		const slug = validatedData.name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.trim();

		const newCategory = await db
			.insert(category)
			.values({
				id: crypto.randomUUID(),
				...validatedData,
				slug,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		return { data: newCategory[0], success: "Categoria criada com sucesso!" };
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Erro ao criar categoria:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Update a category
export async function updateCategory(data: CategoryFormData & { id: string }) {
	try {
		const { id, ...updateData } = data;
		const validatedData = categorySchema.parse(updateData);

		// Generate slug from name
		const slug = validatedData.name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.trim();

		const updatedCategory = await db
			.update(category)
			.set({
				...validatedData,
				slug,
			})
			.where(eq(category.id, id))
			.returning();

		if (updatedCategory.length === 0) {
			return { error: "Categoria não encontrada" };
		}

		return {
			data: updatedCategory[0],
			success: "Categoria atualizada com sucesso!",
		};
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Erro ao atualizar categoria:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Delete a category
export async function deleteCategory(id: string) {
	try {
		// Check if category has subcategories
		const subcategoriesCount = await db
			.select()
			.from(subcategory)
			.where(eq(subcategory.categoryId, id));

		if (subcategoriesCount.length > 0) {
			return {
				error: "Não é possível excluir categoria que possui subcategorias",
			};
		}

		const deletedCategory = await db
			.delete(category)
			.where(eq(category.id, id))
			.returning();

		if (deletedCategory.length === 0) {
			return { error: "Categoria não encontrada" };
		}

		return { success: "Categoria excluída com sucesso!" };
	} catch (error: unknown) {
		console.error("Erro ao excluir categoria:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Create a new subcategory
export async function createSubcategory(data: SubcategoryFormData) {
	try {
		const validatedData = subcategorySchema.parse(data);

		// Generate slug from name
		const slug = validatedData.name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.trim();

		const newSubcategory = await db
			.insert(subcategory)
			.values({
				id: crypto.randomUUID(),
				...validatedData,
				slug,
			})
			.returning();

		return {
			data: newSubcategory[0],
			success: "Subcategoria criada com sucesso!",
		};
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Erro ao criar subcategoria:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Update a subcategory
export async function updateSubcategory(
	data: SubcategoryFormData & { id: string },
) {
	try {
		const { id, ...updateData } = data;
		const validatedData = subcategorySchema.parse(updateData);

		// Generate slug from name
		const slug = validatedData.name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.trim();

		const updatedSubcategory = await db
			.update(subcategory)
			.set({
				...validatedData,
				slug,
			})
			.where(eq(subcategory.id, id))
			.returning();

		if (updatedSubcategory.length === 0) {
			return { error: "Subcategoria não encontrada" };
		}

		return {
			data: updatedSubcategory[0],
			success: "Subcategoria atualizada com sucesso!",
		};
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Erro ao atualizar subcategoria:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Delete a subcategory
export async function deleteSubcategory(id: string) {
	try {
		const deletedSubcategory = await db
			.delete(subcategory)
			.where(eq(subcategory.id, id))
			.returning();

		if (deletedSubcategory.length === 0) {
			return { error: "Subcategoria não encontrada" };
		}

		return { success: "Subcategoria excluída com sucesso!" };
	} catch (error: unknown) {
		console.error("Erro ao excluir subcategoria:", error);
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
