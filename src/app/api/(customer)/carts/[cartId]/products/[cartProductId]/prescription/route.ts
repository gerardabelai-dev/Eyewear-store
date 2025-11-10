import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { cartProduct, order } from "@/lib/db/schema";

const attachPrescriptionSchema = z.object({
	cartId: z.string().min(1, "Cart ID is required"),
	cartProductId: z.string().min(1, "Cart Product ID is required"),
});

const requestBodySchema = z.object({
	prescriptionFileUrl: z.string().url("Invalid file URL"),
	prescriptionFileName: z.string().min(1, "File name is required"),
	prescriptionFileSize: z.number().positive("File size must be positive"),
});

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<z.infer<typeof attachPrescriptionSchema>> },
) {
	try {
		// Validate params
		const paramsResult = attachPrescriptionSchema.safeParse(await params);

		if (!paramsResult.success) {
			return mapInvalidZodResponse(paramsResult.error);
		}

		const { cartId, cartProductId } = paramsResult.data;

		// Parse request body
		const body = await request.json();
		const bodyResult = requestBodySchema.safeParse(body);

		if (!bodyResult.success) {
			return mapInvalidZodResponse(bodyResult.error);
		}

		const { prescriptionFileUrl, prescriptionFileName, prescriptionFileSize } =
			bodyResult.data;

		// Find the cart product
		const cartProductRecord = await db.query.cartProduct.findFirst({
			where: and(
				eq(cartProduct.id, cartProductId),
				eq(cartProduct.cartId, cartId),
			),
			with: {
				product: true,
			},
		});

		if (!cartProductRecord) {
			return NextResponse.json(
				mapErrorCodes(ERROR_CODES.CART_PRODUCT_NOT_FOUND),
				{ status: HTTP_CODES.NOT_FOUND },
			);
		}

		// Update cart product with prescription data
		await db
			.update(cartProduct)
			.set({
				prescriptionFileUrl,
				prescriptionFileName,
				prescriptionFileSize,
				prescriptionUploadedAt: new Date(),
				prescriptionStatus: "uploaded",
			})
			.where(eq(cartProduct.id, cartProductId));

		console.log("✅ Prescription attached to cart product:", {
			cartId,
			cartProductId,
			fileName: prescriptionFileName,
		});

		// Check if all required prescriptions for this cart are uploaded
		const allCartProducts = await db.query.cartProduct.findMany({
			where: eq(cartProduct.cartId, cartId),
			with: {
				product: true,
			},
		});

		// Check if there are any products that require prescription but don't have it
		const hasPendingPrescriptions = allCartProducts.some(
			(cp) =>
				cp.product.requiresPrescription && cp.prescriptionStatus !== "uploaded",
		);

		// Find the order associated with this cart
		const orderRecord = await db.query.order.findFirst({
			where: eq(order.cartId, cartId),
		});

		// If all prescriptions are uploaded and order exists, update order status
		if (!hasPendingPrescriptions && orderRecord) {
			if (orderRecord.orderStatus === "awaiting_prescription") {
				await db
					.update(order)
					.set({
						orderStatus: "paid",
					})
					.where(eq(order.id, orderRecord.id));

				console.log(
					"✅ Order status updated from awaiting_prescription to paid:",
					{
						orderId: orderRecord.id,
					},
				);
			}
		}

		return NextResponse.json({
			success: true,
			prescriptionStatus: "uploaded",
			allPrescriptionsComplete: !hasPendingPrescriptions,
			orderStatusUpdated:
				!hasPendingPrescriptions &&
				orderRecord?.orderStatus === "awaiting_prescription",
		});
	} catch (error) {
		console.error("❌ Error attaching prescription:", error);
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_ATTACH_PRESCRIPTION),
			{ status: HTTP_CODES.INTERNAL_SERVER_ERROR },
		);
	}
}
