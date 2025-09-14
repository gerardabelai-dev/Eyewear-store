import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { cart, cartProduct, product, productPrice } from "@/lib/db/schema";

const addGlassesWithLensesParamsSchema = z.object({
	cartId: z.string(),
});

const addGlassesWithLensesBodySchema = z.object({
	glassesProductId: z.string(),
	lensProductIds: z.array(z.string()),
	quantity: z.number().int().positive().default(1),
});

type AddGlassesWithLensesParams = z.infer<
	typeof addGlassesWithLensesParamsSchema
>;

export async function POST(
	request: Request,
	{ params }: { params: Promise<AddGlassesWithLensesParams> },
) {
	const {
		success: paramsSuccess,
		error: paramsError,
		data: paramsData,
	} = addGlassesWithLensesParamsSchema.safeParse(await params);

	if (!paramsSuccess) {
		return mapInvalidZodResponse(paramsError);
	}

	const body = await request.json();
	const {
		success: bodySuccess,
		error: bodyError,
		data: bodyData,
	} = addGlassesWithLensesBodySchema.safeParse(body);

	if (!bodySuccess) {
		return mapInvalidZodResponse(bodyError);
	}

	const { cartId } = paramsData;
	const { glassesProductId, lensProductIds, quantity } = bodyData;

	try {
		// Check if cart exists
		const cartFound = await db.query.cart.findFirst({
			where: eq(cart.id, cartId),
		});

		if (!cartFound) {
			return Response.json(mapErrorCodes(ERROR_CODES.CART_NOT_FOUND), {
				status: HTTP_CODES.NOT_FOUND,
			});
		}

		// Check if glasses product exists and get its default price
		const glassesProduct = await db.query.product.findFirst({
			where: eq(product.id, glassesProductId),
			with: {
				productPrice: {
					where: eq(productPrice.isDefault, true),
					limit: 1,
				},
			},
		});

		if (!glassesProduct) {
			return Response.json(mapErrorCodes(ERROR_CODES.PRODUCT_NOT_FOUND), {
				status: HTTP_CODES.NOT_FOUND,
			});
		}

		if (
			!glassesProduct.productPrice ||
			glassesProduct.productPrice.length === 0
		) {
			return Response.json(mapErrorCodes(ERROR_CODES.PRODUCT_PRICE_NOT_FOUND), {
				status: HTTP_CODES.NOT_FOUND,
			});
		}

		// Validate all lens products exist and get their prices
		const lensProducts = await Promise.all(
			lensProductIds.map(async (lensProductId) => {
				const lensProduct = await db.query.product.findFirst({
					where: eq(product.id, lensProductId),
					with: {
						productPrice: {
							where: eq(productPrice.isDefault, true),
							limit: 1,
						},
					},
				});

				if (!lensProduct) {
					throw new Error(`Lens product ${lensProductId} not found`);
				}

				if (
					!lensProduct.productPrice ||
					lensProduct.productPrice.length === 0
				) {
					throw new Error(`Lens product ${lensProductId} price not found`);
				}

				return {
					product: lensProduct,
					price: lensProduct.productPrice[0],
				};
			}),
		);

		// Check if this exact combination already exists in the cart
		const existingGroups = await db.query.cartProduct.findMany({
			where: and(
				eq(cartProduct.cartId, cartId),
				eq(cartProduct.productId, glassesProductId),
				eq(cartProduct.parentProductId, null),
			),
		});

		const updatedCartProducts = [];
		let isExistingCombination = false;

		// For each existing glasses item, check if it has the same lens combination
		for (const existingGlasses of existingGroups) {
			if (!existingGlasses.groupId) continue;

			const existingLensOptions = await db.query.cartProduct.findMany({
				where: and(
					eq(cartProduct.cartId, cartId),
					eq(cartProduct.groupId, existingGlasses.groupId),
					eq(cartProduct.parentProductId, glassesProductId),
				),
			});

			// Create sorted arrays of lens product IDs for comparison
			const existingLensIds = existingLensOptions
				.map((lens) => lens.productId)
				.sort();
			const newLensIds = lensProductIds.slice().sort();

			// Check if the lens combinations are identical
			if (JSON.stringify(existingLensIds) === JSON.stringify(newLensIds)) {
				// Identical combination found - update quantity
				const [updatedGlasses] = await db
					.update(cartProduct)
					.set({
						quantity: existingGlasses.quantity + quantity,
						updatedAt: new Date(),
					})
					.where(eq(cartProduct.id, existingGlasses.id))
					.returning();

				updatedCartProducts.push(updatedGlasses);

				// Also update lens option quantities
				for (const existingLens of existingLensOptions) {
					const [updatedLens] = await db
						.update(cartProduct)
						.set({
							quantity: existingLens.quantity + quantity,
							updatedAt: new Date(),
						})
						.where(eq(cartProduct.id, existingLens.id))
						.returning();

					updatedCartProducts.push(updatedLens);
				}

				isExistingCombination = true;
				break;
			}
		}

		// If no identical combination exists, create new items
		if (!isExistingCombination) {
			// Generate a unique group ID for this combination
			const groupId = `grp_${Date.now()}_${Math.random().toString(36).substring(2)}`;

			// Add glasses product to cart
			const [glassesCartProduct] = await db
				.insert(cartProduct)
				.values({
					cartId,
					productId: glassesProductId,
					productPriceId: glassesProduct.productPrice[0].id,
					quantity,
					parentProductId: null, // Glasses is the parent product
					groupId, // Assign group ID
				})
				.returning();

			updatedCartProducts.push(glassesCartProduct);

			// Add each lens product to cart with glasses as parent
			for (const { product: lensProduct, price: lensPrice } of lensProducts) {
				const [lensCartProduct] = await db
					.insert(cartProduct)
					.values({
						cartId,
						productId: lensProduct.id,
						productPriceId: lensPrice.id,
						quantity,
						parentProductId: glassesProductId, // Reference the glasses product
						groupId, // Same group ID as the glasses
					})
					.returning();

				updatedCartProducts.push(lensCartProduct);
			}
		}

		return NextResponse.json({
			cartProducts: updatedCartProducts,
			message: isExistingCombination
				? `Updated quantity for existing glasses with ${lensProductIds.length} lens options`
				: `Added glasses with ${lensProductIds.length} lens options to cart`,
			isExistingCombination,
		});
	} catch (error) {
		console.error("Error adding glasses with lenses to cart:", error);
		return Response.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_ADD_PRODUCT_TO_CART),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}
}
