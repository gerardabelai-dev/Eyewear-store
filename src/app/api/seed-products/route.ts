import { seedProducts } from "@/lib/actions/product";

export async function POST() {
	try {
		console.log("🛍️ Starting product seeding...");

		// Seed global products
		const result = await seedProducts();

		if (result.success) {
			console.log("✅", result.success);
			return Response.json({
				success: result.success,
				data: result.data,
			});
		} else {
			console.error("❌ Error seeding products:", result.error);
			return Response.json({ error: result.error }, { status: 500 });
		}
	} catch (error) {
		console.error("❌ Unexpected error:", error);
		return Response.json(
			{ error: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}
