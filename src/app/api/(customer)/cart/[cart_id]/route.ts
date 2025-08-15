import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { cart } from "@/lib/db/schema";

const getCartByIdSchema = z.object({
	cart_id: z.string(),
});

type GetCartByIdResponse = z.infer<typeof getCartByIdSchema>;

export async function GET(
	_request: Request,
	{ params }: { params: Promise<GetCartByIdResponse> },
) {
	const { success, error, data } = getCartByIdSchema.safeParse(await params);

	if (!success) {
		return Response.json(
			{
				message: error.message,
				errors: error.issues.map((issue) => issue.message),
			},
			{ status: 400 },
		);
	}

	const { cart_id } = data;

	const cartFound = await db.query.cart.findFirst({
		where: eq(cart.id, cart_id),
		with: {
			cartProducts: {
				with: {
					product: {
						with: {
							productPrice: true,
							images: true,
						},
					},
					productPrice: true,
				},
			},
		},
	});

	if (!cartFound) {
		return Response.json(
			{
				message: `Cart ${cart_id} not found`,
			},
			{ status: 404 },
		);
	}

	return NextResponse.json({
		id: cartFound.id,
		items: cartFound.cartProducts,
		createdAt: cartFound.createdAt,
		updatedAt: cartFound.updatedAt,
	});
}
