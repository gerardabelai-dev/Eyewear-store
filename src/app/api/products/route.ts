import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { category, product, subcategory } from "@/lib/db/schema";

// Copy schemas from original product.ts
const createProductSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(500).optional(),
	price: z
		.string()
		.refine(
			(val) => !Number.isNaN(parseFloat(val)) && parseFloat(val) > 0,
			"Preço inválido",
		),
	stock: z
		.string()
		.refine(
			(val) => !Number.isNaN(parseInt(val)) && parseInt(val) >= 0,
			"Estoque inválido",
		),
	categoryId: z.string().min(1),
	subcategoryId: z.string().optional(),
	images: z.array(z.string().url()).max(6).optional(),
});
// Other schemas...

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();
		const currentUser = await getCurrentUser();
		if (!currentUser)
			return NextResponse.json(
				{ error: "Usuário não autenticado" },
				{ status: 401 },
			);
		const validatedData = createProductSchema.parse(data);
		// Insert logic
		const newProduct = await db
			.insert(product)
			.values({
				id: crypto.randomUUID(),
				name: validatedData.name,
				description: validatedData.description || null,
				price: validatedData.price,
				stock: parseInt(validatedData.stock),
				status: "active",
				categoryId: validatedData.categoryId,
				subcategoryId: validatedData.subcategoryId || null,
				images: validatedData.images || [],
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();
		return NextResponse.json({ data: newProduct });
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}
// PUT for update, DELETE, etc.
