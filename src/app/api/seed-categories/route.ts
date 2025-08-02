import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { category, subcategory } from "@/lib/db/schema";

export async function GET() {
	try {
		// Clear existing data
		await db.delete(subcategory);
		await db.delete(category);

		// Seed categories
		const categories = [
			{
				id: nanoid(),
				name: "Eletrônicos",
				slug: "eletronicos",
				description: "Produtos eletrônicos em geral",
			},
			{
				id: nanoid(),
				name: "Roupas",
				slug: "roupas",
				description: "Roupas e acessórios",
			},
			{
				id: nanoid(),
				name: "Casa e Jardim",
				slug: "casa-jardim",
				description: "Produtos para casa e jardim",
			},
			{
				id: nanoid(),
				name: "Esportes",
				slug: "esportes",
				description: "Equipamentos e roupas esportivas",
			},
		];

		const insertedCategories = await db
			.insert(category)
			.values(categories)
			.returning();

		// Seed subcategories
		const subcategories = [
			{
				id: nanoid(),
				name: "Smartphones",
				slug: "smartphones",
				description: "Celulares e smartphones",
				categoryId: insertedCategories[0].id,
			},
			{
				id: nanoid(),
				name: "Notebooks",
				slug: "notebooks",
				description: "Laptops e notebooks",
				categoryId: insertedCategories[0].id,
			},
			{
				id: nanoid(),
				name: "Camisetas",
				slug: "camisetas",
				description: "Camisetas em geral",
				categoryId: insertedCategories[1].id,
			},
			{
				id: nanoid(),
				name: "Calças",
				slug: "calcas",
				description: "Calças e bermudas",
				categoryId: insertedCategories[1].id,
			},
			{
				id: nanoid(),
				name: "Móveis",
				slug: "moveis",
				description: "Móveis para casa",
				categoryId: insertedCategories[2].id,
			},
			{
				id: nanoid(),
				name: "Academia",
				slug: "academia",
				description: "Equipamentos para academia",
				categoryId: insertedCategories[3].id,
			},
		];

		await db.insert(subcategory).values(subcategories);

		return NextResponse.json({
			success: true,
			message: "Categories seeded successfully",
			count: categories.length + subcategories.length,
		});
	} catch (error) {
		console.error("Error seeding categories:", error);
		return NextResponse.json(
			{ error: "Failed to seed categories" },
			{ status: 500 },
		);
	}
}
