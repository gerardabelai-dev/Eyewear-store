import { type NextRequest, NextResponse } from "next/server";
import {
	getCategoriesQuery,
	getSubcategoriesByCategoryQuery,
} from "@/lib/queries/categories";

// Handle in POST if data.type === 'subcategory'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	if (searchParams.get("type") === "subcategories") {
		const categoryId = searchParams.get("categoryId") || "";
		if (categoryId)
			return NextResponse.json(
				await getSubcategoriesByCategoryQuery(categoryId),
			);
	}
	if (searchParams.get("type") === "deletion") {
		const id = searchParams.get("id");
		// Call queries and return
	}
	return NextResponse.json(await getCategoriesQuery());
}
