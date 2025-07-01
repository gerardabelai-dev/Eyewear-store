"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";

// Schemas for validation
const createProductSchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
	description: z
		.string()
		.max(500, "Descrição deve ter no máximo 500 caracteres")
		.optional(),
	price: z.string().refine((val) => {
		const num = parseFloat(val);
		return !Number.isNaN(num) && num > 0;
	}, "Preço deve ser um valor válido maior que 0"),
	stock: z.string().refine((val) => {
		const num = parseInt(val);
		return !Number.isNaN(num) && num >= 0;
	}, "Estoque deve ser um número válido maior ou igual a 0"),
	category: z.string().min(1, "Categoria é obrigatória"),
	images: z
		.array(z.string().url("URL da imagem inválida"))
		.max(6, "Máximo de 6 imagens permitidas")
		.optional(),
});

const updateProductSchema = z.object({
	id: z.string().min(1, "ID é obrigatório"),
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
	description: z
		.string()
		.max(500, "Descrição deve ter no máximo 500 caracteres")
		.optional(),
	price: z.string().refine((val) => {
		const num = parseFloat(val);
		return !Number.isNaN(num) && num > 0;
	}, "Preço deve ser um valor válido maior que 0"),
	stock: z.string().refine((val) => {
		const num = parseInt(val);
		return !Number.isNaN(num) && num >= 0;
	}, "Estoque deve ser um número válido maior ou igual a 0"),
	category: z.string().min(1, "Categoria é obrigatória"),
	images: z
		.array(z.string().url("URL da imagem inválida"))
		.max(6, "Máximo de 6 imagens permitidas")
		.optional(),
});

// Get all products for current user
export async function getProducts() {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const products = await db
			.select()
			.from(product)
			.where(eq(product.userId, currentUser.id))
			.orderBy(product.createdAt);

		return { data: products };
	} catch (error) {
		console.error("Erro ao buscar produtos:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Create a new product
export async function createProduct(data: z.infer<typeof createProductSchema>) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const validatedData = createProductSchema.parse(data);

		const newProduct = await db
			.insert(product)
			.values({
				id: crypto.randomUUID(),
				name: validatedData.name,
				description: validatedData.description || null,
				price: validatedData.price,
				stock: parseInt(validatedData.stock),
				category: validatedData.category,
				images: validatedData.images || [],
				userId: currentUser.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		revalidatePath("/produtos");
		return { data: newProduct[0], success: "Produto criado com sucesso" };
	} catch (error) {
		console.error("Erro ao criar produto:", error);
		if (error instanceof z.ZodError) {
			return {
				error: error.errors[0]?.message || "Dados inválidos fornecidos",
			};
		}
		return { error: "Erro interno do servidor" };
	}
}

// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const validatedData = updateProductSchema.parse(data);

		// Check if product belongs to current user
		const existingProduct = await db
			.select()
			.from(product)
			.where(eq(product.id, validatedData.id))
			.limit(1);

		if (
			!existingProduct.length ||
			existingProduct[0].userId !== currentUser.id
		) {
			return { error: "Produto não encontrado ou acesso negado" };
		}

		const updatedProduct = await db
			.update(product)
			.set({
				name: validatedData.name,
				description: validatedData.description || null,
				price: validatedData.price,
				stock: parseInt(validatedData.stock),
				category: validatedData.category,
				images: validatedData.images || [],
				updatedAt: new Date(),
			})
			.where(eq(product.id, validatedData.id))
			.returning();

		revalidatePath("/produtos");
		return {
			data: updatedProduct[0],
			success: "Produto atualizado com sucesso",
		};
	} catch (error) {
		console.error("Erro ao atualizar produto:", error);
		if (error instanceof z.ZodError) {
			return {
				error: error.errors[0]?.message || "Dados inválidos fornecidos",
			};
		}
		return { error: "Erro interno do servidor" };
	}
}

// Delete a product
export async function deleteProduct(productId: string) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		// Check if product belongs to current user
		const existingProduct = await db
			.select()
			.from(product)
			.where(eq(product.id, productId))
			.limit(1);

		if (
			!existingProduct.length ||
			existingProduct[0].userId !== currentUser.id
		) {
			return { error: "Produto não encontrado ou acesso negado" };
		}

		await db.delete(product).where(eq(product.id, productId));

		revalidatePath("/produtos");
		return { success: "Produto deletado com sucesso" };
	} catch (error) {
		console.error("Erro ao deletar produto:", error);
		return { error: "Erro interno do servidor" };
	}
}
