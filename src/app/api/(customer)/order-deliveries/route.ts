import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import z from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { order, orderDelivery, orderDeliveryMethod } from "@/lib/db/schema";

const createOrderDeliverySchema = z.object({
	orderId: z.string(),
	orderDeliveryMethodId: z.string(),
});

export async function POST(request: Request) {
	const body = await request.json();

	const { success, error, data } = createOrderDeliverySchema.safeParse(body);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { orderId, orderDeliveryMethodId } = data;

	const orderFound = await db.query.order.findFirst({
		where: eq(order.id, orderId),
	});

	if (!orderFound) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.ORDER_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	const orderDeliveryFound = await db.query.orderDelivery.findFirst({
		where: eq(orderDelivery.orderId, orderId),
	});

	if (orderDeliveryFound) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.ORDER_ALREADY_HAS_DELIVERY_METHOD),
			{
				status: HTTP_CODES.BAD_REQUEST,
			},
		);
	}

	const orderDeliveryMethodFound = await db.query.orderDeliveryMethod.findFirst(
		{
			where: eq(orderDeliveryMethod.id, orderDeliveryMethodId),
		},
	);

	if (!orderDeliveryMethodFound) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.ORDER_DELIVERY_METHODS_NOT_FOUND),
			{
				status: HTTP_CODES.NOT_FOUND,
			},
		);
	}

	const [orderDeliveryCreated] = await db
		.insert(orderDelivery)
		.values({
			orderId,
			orderDeliveryMethodId,
		})
		.returning();

	if (!orderDeliveryCreated) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_ORDER_DELIVERY),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}

	return NextResponse.json({
		orderDelivery: orderDeliveryCreated,
	});
}

const updateOrderDeliverySchema = z.object({
	orderId: z.string(),
	orderDeliveryMethodId: z.string(),
});

export async function PATCH(request: Request) {
	const body = await request.json();

	const { success, error, data } = updateOrderDeliverySchema.safeParse(body);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { orderId, orderDeliveryMethodId } = data;

	try {
		// Check if order exists
		const orderFound = await db.query.order.findFirst({
			where: eq(order.id, orderId),
		});

		if (!orderFound) {
			return NextResponse.json(mapErrorCodes(ERROR_CODES.ORDER_NOT_FOUND), {
				status: HTTP_CODES.NOT_FOUND,
			});
		}

		// Check if delivery method exists
		const orderDeliveryMethodFound =
			await db.query.orderDeliveryMethod.findFirst({
				where: eq(orderDeliveryMethod.id, orderDeliveryMethodId),
			});

		if (!orderDeliveryMethodFound) {
			return NextResponse.json(
				mapErrorCodes(ERROR_CODES.ORDER_DELIVERY_METHODS_NOT_FOUND),
				{
					status: HTTP_CODES.NOT_FOUND,
				},
			);
		}

		// Check if order delivery exists
		const existingOrderDelivery = await db.query.orderDelivery.findFirst({
			where: eq(orderDelivery.orderId, orderId),
		});

		let updatedOrderDelivery: typeof orderDelivery.$inferSelect;

		if (existingOrderDelivery) {
			// Update existing order delivery
			const [updated] = await db
				.update(orderDelivery)
				.set({
					orderDeliveryMethodId,
					updatedAt: new Date(),
				})
				.where(eq(orderDelivery.orderId, orderId))
				.returning();

			updatedOrderDelivery = updated;
		} else {
			// Create new order delivery if it doesn't exist
			const [created] = await db
				.insert(orderDelivery)
				.values({
					orderId,
					orderDeliveryMethodId,
				})
				.returning();

			updatedOrderDelivery = created;
		}

		if (!updatedOrderDelivery) {
			return NextResponse.json(
				mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_ORDER_DELIVERY),
				{
					status: HTTP_CODES.INTERNAL_SERVER_ERROR,
				},
			);
		}

		return NextResponse.json({
			orderDelivery: updatedOrderDelivery,
		});
	} catch (error) {
		console.error("Error updating order delivery:", error);
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_ORDER_DELIVERY),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}
}
