import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequestResponse } from "@/app/api/utils/bad-request-response";
import { db } from "@/lib/db";
import { cart } from "@/lib/db/schema";

const getCartByIdSchema = z.object({
	cartId: z.string(),
});

type GetCartByIdResponse = z.infer<typeof getCartByIdSchema>;

export async function GET(
	_request: Request,
	{ params }: { params: Promise<GetCartByIdResponse> },
) {
	const { success, error, data } = getCartByIdSchema.safeParse(await params);

	if (!success) {
		return badRequestResponse(error);
	}

	const { cartId } = data;

	const cartFound = await db.query.cart.findFirst({
		where: eq(cart.id, cartId),
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
				message: `Cart ${cartId} not found`,
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
