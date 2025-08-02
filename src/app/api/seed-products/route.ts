import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { category, product, subcategory } from "@/lib/db/schema";

export async function POST() {
	try {
		return NextResponse.json({
			success: true,
			message: "Products endpoint working",
		});
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json({ error: "Failed" }, { status: 500 });
	}
}
