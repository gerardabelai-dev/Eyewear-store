"use server";

import { and, eq, ilike, or } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { category, product, subcategory } from "@/lib/db/schema";

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
	categoryId: z.string().min(1, "Categoria é obrigatória"),
	subcategoryId: z.string().optional(),
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
	categoryId: z.string().min(1, "Categoria é obrigatória"),
	subcategoryId: z.string().optional(),
	images: z
		.array(z.string().url("URL da imagem inválida"))
		.max(6, "Máximo de 6 imagens permitidas")
		.optional(),
});

// Internal function to get products
async function _getProductsInternal() {
	const products = await db
		.select({
			id: product.id,
			name: product.name,
			description: product.description,
			price: product.price,
			stock: product.stock,
			status: product.status,
			categoryId: product.categoryId,
			subcategoryId: product.subcategoryId,
			images: product.images,
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
			categoryName: category.name,
			categorySlug: category.slug,
			subcategoryName: subcategory.name,
			subcategorySlug: subcategory.slug,
		})
		.from(product)
		.leftJoin(category, eq(product.categoryId, category.id))
		.leftJoin(subcategory, eq(product.subcategoryId, subcategory.id))
		.orderBy(product.name);

	return products;
}

// Cached version of getProducts
const getCachedProducts = unstable_cache(
	async () => _getProductsInternal(),
	["products"],
	{
		revalidate: 60, // Cache for 60 seconds
		tags: ["products"],
	},
);

// Get all products with category info
export async function getProducts() {
	try {
		const products = await getCachedProducts();
		return { data: products };
	} catch (error) {
		console.error("Erro ao buscar produtos:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Create a new product
export async function createProduct(data: z.infer<typeof createProductSchema>) {
	try {
		const validatedData = createProductSchema.parse(data);

		const newProduct = await db
			.insert(product)
			.values({
				id: crypto.randomUUID(),
				name: validatedData.name,
				description: validatedData.description || null,
				price: validatedData.price,
				stock: parseInt(validatedData.stock),
				categoryId: validatedData.categoryId,
				subcategoryId: validatedData.subcategoryId || null,
				images: validatedData.images || [],
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		revalidateTag("products");
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
		const validatedData = updateProductSchema.parse(data);

		// Check if product exists
		const existingProduct = await db
			.select()
			.from(product)
			.where(eq(product.id, validatedData.id))
			.limit(1);

		if (!existingProduct.length) {
			return { error: "Produto não encontrado" };
		}

		const updatedProduct = await db
			.update(product)
			.set({
				name: validatedData.name,
				description: validatedData.description || null,
				price: validatedData.price,
				stock: parseInt(validatedData.stock),
				categoryId: validatedData.categoryId,
				subcategoryId: validatedData.subcategoryId || null,
				images: validatedData.images || [],
				updatedAt: new Date(),
			})
			.where(eq(product.id, validatedData.id))
			.returning();

		revalidateTag("products");
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
		// Check if product exists
		const existingProduct = await db
			.select()
			.from(product)
			.where(eq(product.id, productId))
			.limit(1);

		if (!existingProduct.length) {
			return { error: "Produto não encontrado" };
		}

		await db.delete(product).where(eq(product.id, productId));

		revalidateTag("products");
		revalidatePath("/produtos");
		return { success: "Produto deletado com sucesso" };
	} catch (error) {
		console.error("Erro ao deletar produto:", error);

		// Extract meaningful error message from database error
		if (
			error &&
			typeof error === "object" &&
			"detail" in error &&
			typeof error.detail === "string"
		) {
			return { error: error.detail };
		}

		// Fallback to generic error
		return { error: "Erro interno do servidor" };
	}
}

// Helper function to get real glasses images from Unsplash
function getGlassesImages(productIndex: number): string[] {
	const availableImages = [
		"https://images.unsplash.com/photo-1649303922416-75f631e6ac8e?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1652837345706-6a0f9c0148c0?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1648688135643-2716ec8f4b24?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1701252374715-b5d8ab0b5f2c?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1653268986450-838b2f07e835?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1619089661769-3101dbac9257?q=80&w=1128&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1475312775467-159e03aaa7cd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	];

	// Return 1-3 images based on product index
	const numImages = (productIndex % 3) + 1; // 1, 2, or 3 images
	const startIndex = (productIndex * 2) % availableImages.length;

	const selectedImages = [];
	for (let i = 0; i < numImages; i++) {
		const imageIndex = (startIndex + i) % availableImages.length;
		selectedImages.push(availableImages[imageIndex]);
	}

	return selectedImages;
}

// Seed sample products for testing - only glasses products (1 per subcategory)
export async function seedProducts() {
	try {
		console.log("🌱 Seeding glasses products with placeholder images...");

		const sampleProducts = [
			// Óculos de Grau - Masculino
			{
				id: crypto.randomUUID(),
				name: "Ray-Ban RB5154 Clubmaster",
				description:
					"Óculos de grau clássico masculino com armação em acetato premium. Design atemporal que combina sofisticação e durabilidade. Hastes flexíveis para maior conforto durante todo o dia. Ideal para rostos ovais e quadrados.",
				price: "450.00",
				stock: 25,
				categoryId: "oculos-grau",
				subcategoryId: "grau-masculino",
				images: getGlassesImages(0),
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Óculos de Grau - Feminino
			{
				id: crypto.randomUUID(),
				name: "Dior Stellaire O2",
				description:
					"Elegante armação feminina em metal dourado com detalhes exclusivos da marca. Lentes de qualidade superior com tratamento anti-reflexo. Design sofisticado que realça a feminilidade.",
				price: "1250.00",
				stock: 8,
				categoryId: "oculos-grau",
				subcategoryId: "grau-feminino",
				images: getGlassesImages(1),
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Óculos de Grau - Progressivo
			{
				id: crypto.randomUUID(),
				name: "Varilux Comfort Max",
				description:
					"Lentes progressivas de última geração com tecnologia avançada de transição suave entre os campos de visão. Ideal para presbiopia, oferecendo visão nítida para longe, intermediária e perto sem linhas visíveis.",
				price: "1850.00",
				stock: 2,
				categoryId: "oculos-grau",
				subcategoryId: "grau-progressivo",
				images: getGlassesImages(2),
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Óculos de Sol - Aviador
			{
				id: crypto.randomUUID(),
				name: "Ray-Ban Aviator Classic",
				description:
					"O clássico aviador que nunca sai de moda. Proteção UV400 e qualidade premium para máxima proteção solar.",
				price: "520.00",
				stock: 15,
				categoryId: "oculos-sol",
				subcategoryId: "sol-aviador",
				images: getGlassesImages(3),
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Óculos de Sol - Esportivo
			{
				id: crypto.randomUUID(),
				name: "Oakley Holbrook",
				description:
					"Óculos de sol esportivo com design contemporâneo e lentes polarizadas para máxima proteção solar. Armação em O Matter resistente a impactos. Ideal para atividades ao ar livre e esportes.",
				price: "720.00",
				stock: 22,
				categoryId: "oculos-sol",
				subcategoryId: "sol-esportivo",
				images: getGlassesImages(4),
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Óculos de Sol - Feminino
			{
				id: crypto.randomUUID(),
				name: "Chanel CH5450",
				description:
					"Luxo e elegância em cada detalhe. Proteção solar premium com style. Design sofisticado para mulheres que valorizam qualidade e exclusividade.",
				price: "2100.00",
				stock: 5,
				categoryId: "oculos-sol",
				subcategoryId: "sol-feminino",
				images: getGlassesImages(5),
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		// Insert all sample products
		const createdProducts = await db
			.insert(product)
			.values(sampleProducts)
			.returning();

		return {
			data: createdProducts,
			success: `${createdProducts.length} produtos de exemplo criados com sucesso!`,
		};
	} catch (error) {
		console.error("Erro ao criar produtos de exemplo:", error);
		if (error instanceof z.ZodError) {
			return {
				error: error.errors[0]?.message || "Dados inválidos fornecidos",
			};
		}
		return { error: "Erro interno do servidor" };
	}
}
