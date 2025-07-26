import { NextResponse } from "next/server";
import { seedCategories } from "@/lib/actions/category";

export async function GET() {
	try {
		const result = await seedCategories();

		if (result.error) {
			return NextResponse.json({ error: result.error }, { status: 400 });
		}

		return NextResponse.json({
			success: true,
			message: result.success,
		});
	} catch (error) {
		console.error("Error seeding categories:", error);
		return NextResponse.json(
			{ error: "Failed to seed categories" },
			{ status: 500 },
		);
	}
}
