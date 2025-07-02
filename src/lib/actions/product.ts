"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
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

// Get all products with category info
export async function getProducts() {
	try {
		const products = await db
			.select({
				id: product.id,
				name: product.name,
				description: product.description,
				price: product.price,
				stock: product.stock,
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

		revalidatePath("/produtos");
		return { success: "Produto deletado com sucesso" };
	} catch (error) {
		console.error("Erro ao deletar produto:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Seed sample products for testing
export async function seedProducts() {
	try {
		const sampleProducts = [
			// Óculos de Grau - Masculino - Various characteristics
			{
				id: crypto.randomUUID(),
				name: "Ray-Ban RB5154 Clubmaster",
				description:
					"Óculos de grau clássico masculino com armação em acetato premium. Design atemporal que combina sofisticação e durabilidade. Hastes flexíveis para maior conforto durante todo o dia. Ideal para rostos ovais e quadrados. Acompanha estojo rígido e flanela para limpeza.",
				price: "450.00",
				stock: 25,
				categoryId: "oculos-grau",
				subcategoryId: "grau-masculino",
				images: [
					"https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400",
					"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
					"https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400",
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: crypto.randomUUID(),
				name: "Oakley OX8156",
				description: "Esportivo e resistente.",
				price: "680.00",
				stock: 3, // Low stock
				categoryId: "oculos-grau",
				subcategoryId: "grau-masculino",
				images: [
					"https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400",
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Óculos de Grau - Feminino
			{
				id: crypto.randomUUID(),
				name: "Dior Stellaire O2",
				description:
					"Elegante armação feminina em metal dourado com detalhes exclusivos da marca. Lentes de qualidade superior com tratamento anti-reflexo. Design sofisticado que realça a feminilidade. Perfeito para ocasiões especiais e uso profissional.",
				price: "1250.00", // High price
				stock: 8,
				categoryId: "oculos-grau",
				subcategoryId: "grau-feminino",
				images: [
					"https://images.unsplash.com/photo-1577803645773-f96470509666?w=400",
					"https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400",
					"https://images.unsplash.com/photo-1544924187-6d27097d6bf4?w=400",
					"https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400",
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: crypto.randomUUID(),
				name: "Armação Delicada Rosa",
				description: "Leve e confortável para uso diário. Cor rosa suave.",
				price: "180.00", // Low price
				stock: 45, // High stock
				categoryId: "oculos-grau",
				subcategoryId: "grau-feminino",
				images: [
					"https://images.unsplash.com/photo-1564131071-de4f7fb3e2ef?w=400",
					"https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400",
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Óculos de Grau - Progressivo (same category, different subcategory)
			{
				id: crypto.randomUUID(),
				name: "Varilux Comfort Max Multifocal Premium Progressive Lens Technology Advanced",
				description:
					"Lentes progressivas de última geração com tecnologia avançada de transição suave entre os campos de visão. Ideal para presbiopia, oferecendo visão nítida para longe, intermediária e perto sem linhas visíveis. Armação em titânio ultraleve com design ergonômico. Tratamento anti-reflexo, anti-risco e hidrofóbico incluso. Garantia de adaptação de 30 dias.",
				price: "1850.00", // Very high price
				stock: 2, // Very low stock
				categoryId: "oculos-grau",
				subcategoryId: "grau-progressivo",
				images: [
					"https://images.unsplash.com/photo-1503328427499-d92d1ac3d174?w=400",
					"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
					"https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400",
					"https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400",
					"https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400",
					"https://images.unsplash.com/photo-1544924187-6d27097d6bf4?w=400",
				], // 6 images
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Óculos de Sol - Masculino (different category)
			{
				id: crypto.randomUUID(),
				name: "Ray-Ban Aviator Classic",
				description:
					"O clássico aviador que nunca sai de moda. Proteção UV400 e qualidade premium.",
				price: "520.00",
				stock: 15,
				categoryId: "oculos-sol",
				subcategoryId: "sol-aviador",
				images: [
					"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
					"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
					"https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400",
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: crypto.randomUUID(),
				name: "Oakley Holbrook",
				description:
					"Óculos de sol esportivo com design contemporâneo e lentes polarizadas para máxima proteção solar. Armação em O Matter resistente a impactos. Ideal para atividades ao ar livre e esportes. Tecnologia HDO para visão cristalina.",
				price: "720.00",
				stock: 22,
				categoryId: "oculos-sol",
				subcategoryId: "sol-esportivo",
				images: [
					"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
				], // Only 1 image
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Óculos de Sol - Feminino (same category, different subcategory)
			{
				id: crypto.randomUUID(),
				name: "Chanel CH5450",
				description:
					"Luxo e elegância em cada detalhe. Proteção solar premium com style.",
				price: "2100.00", // Very high price
				stock: 5,
				categoryId: "oculos-sol",
				subcategoryId: "sol-feminino",
				images: [
					"https://images.unsplash.com/photo-1502767089025-6572583495b9?w=400",
					"https://images.unsplash.com/photo-1535491969645-8d6d2c6b7156?w=400",
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Lentes de Contato - Different category entirely
			{
				id: crypto.randomUUID(),
				name: "Acuvue Oasys Diárias",
				description:
					"Lentes de contato diárias com tecnologia HydraLuxe para hidratação duradoura.",
				price: "85.00", // Low price
				stock: 100, // Very high stock
				categoryId: "lentes-contato",
				subcategoryId: "lentes-diarias",
				images: [
					"https://images.unsplash.com/photo-1551029506-0807df4e2031?w=400",
					"https://images.unsplash.com/photo-1590172038866-0ec84b167bad?w=400",
					"https://images.unsplash.com/photo-1617016254851-c6ee82dd19c8?w=400",
					"https://images.unsplash.com/photo-1622013452703-9cd89bd4b3ee?w=400",
					"https://images.unsplash.com/photo-1612033299208-ad1ef8e7fb6e?w=400",
				], // 5 images
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: crypto.randomUUID(),
				name: "Biofinity Mensais Astigmatismo",
				description:
					"Lentes de contato mensais especialmente desenvolvidas para correção de astigmatismo. Tecnologia Aquaform que retém a umidade natural dos olhos. Material silicone hidrogel para maior permeabilidade ao oxigênio. Caixa com 6 unidades.",
				price: "145.00",
				stock: 0, // Out of stock
				categoryId: "lentes-contato",
				subcategoryId: "lentes-astigmatismo",
				images: [
					"https://images.unsplash.com/photo-1551029506-0807df4e2031?w=400",
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Armações
			{
				id: crypto.randomUUID(),
				name: "Armação Titânio Ultralight",
				description: "Extremamente leve e resistente.",
				price: "320.00",
				stock: 12,
				categoryId: "armacoes",
				subcategoryId: "armacao-titanio",
				images: [
					"https://images.unsplash.com/photo-1517639418742-0d6a8b6fcf9f?w=400",
					"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Acessórios
			{
				id: crypto.randomUUID(),
				name: "Estojo Rígido Premium Couro Legítimo Proteção Máxima",
				description:
					"Estojo de proteção em couro legítimo com forro em veludo para máxima proteção dos seus óculos. Interior acolchoado e fecho magnético seguro. Design elegante e durável. Dimensões compatíveis com a maioria dos modelos de óculos.",
				price: "89.00",
				stock: 35,
				categoryId: "acessorios",
				subcategoryId: "estojos",
				images: [
					"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Infantil
			{
				id: crypto.randomUUID(),
				name: "Kids Safety Blue",
				description:
					"Óculos de grau infantil com armação flexível e proteção anti-impacto. Cores divertidas e design ergonômico adaptado para crianças de 6 a 12 anos. Material hipoalergênico e cordão de segurança incluso.",
				price: "250.00",
				stock: 18,
				categoryId: "infantil",
				subcategoryId: "infantil-grau",
				images: [
					"https://images.unsplash.com/photo-1554466615-9d2eb9e88e20?w=400",
					"https://images.unsplash.com/photo-1504178451683-27f33d13dae5?w=400",
					"https://images.unsplash.com/photo-1617016254851-c6ee82dd19c8?w=400",
				],
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
