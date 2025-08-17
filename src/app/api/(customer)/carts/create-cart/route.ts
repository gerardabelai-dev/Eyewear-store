import { NextResponse } from "next/server";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { db } from "@/lib/db";
import { cart } from "@/lib/db/schema";

export async function POST() {
	try {
		const [cartCreated] = await db.insert(cart).values({}).returning();

		if (!cartCreated) {
			return Response.json(mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_CART), {
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			});
		}

		return NextResponse.json({
			cart: {
				id: cartCreated.id,
				createdAt: cartCreated.createdAt,
				updatedAt: cartCreated.updatedAt,
			},
		});
	} catch (error) {
		console.error("Error creating cart:", error);
		return Response.json(mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_CART), {
			status: HTTP_CODES.INTERNAL_SERVER_ERROR,
		});
	}
}
