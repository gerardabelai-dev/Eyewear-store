import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

const checkEmailSchema = z.object({
	email: z.string().email(),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const { success, data: validatedData } = checkEmailSchema.safeParse(body);

		if (!success) {
			return NextResponse.json(
				{ exists: false, error: "Formato de email inválido" },
				{ status: 400 },
			);
		}

		const { email } = validatedData;

		// Check if user exists with this email
		const existingUser = await db.query.user.findFirst({
			where: eq(user.email, email),
		});

		return NextResponse.json({
			exists: !!existingUser,
		});
	} catch (error) {
		console.error("Error checking email:", error);
		return NextResponse.json(
			{ exists: false, error: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}
