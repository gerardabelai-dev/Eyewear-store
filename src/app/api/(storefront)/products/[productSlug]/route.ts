import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { product, productPrice } from "@/lib/db/schema";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
	return NextResponse.json({}, { headers: corsHeaders });
}

const getProductBySlugSchema = z.object({
	productSlug: z.string(),
});
type GetProductBySlugResponse = z.infer<typeof getProductBySlugSchema>;

export async function GET(
	_request: Request,
	{ params }: { params: Promise<GetProductBySlugResponse> },
) {
	const { success, error, data } = getProductBySlugSchema.safeParse(
		await params,
	);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { productSlug } = data;

	const productFound = await db.query.product.findFirst({
		where: eq(product.slug, productSlug),
		with: {
			productPrice: {
				where: eq(productPrice.isDefault, true),
				limit: 1,
			},
			images: {
				orderBy: (productImage, { desc }) => [
					desc(productImage.isDefault),
					productImage.createdAt,
				],
			},
		},
	});

	if (!productFound) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.PRODUCT_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
			headers: corsHeaders,
		});
	}

	return NextResponse.json({ product: productFound }, { headers: corsHeaders });
}
