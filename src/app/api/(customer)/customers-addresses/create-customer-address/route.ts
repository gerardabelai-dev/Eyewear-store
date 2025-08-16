import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import z from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { customer, customerAddress, order } from "@/lib/db/schema";

const createCustomerAddressSchema = z.object({
	orderId: z.string(),
	street: z.string(),
	number: z.string(),
	complement: z.string(),
	neighborhood: z.string(),
	city: z.string(),
	state: z.string(),
	zipCode: z.string(),
	country: z.string(),
	isDefault: z.boolean(),
});

export async function POST(request: Request) {
	const body = await request.json();

	const { success, error, data } = createCustomerAddressSchema.safeParse(body);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const {
		orderId,
		street,
		number,
		complement,
		neighborhood,
		city,
		state,
		zipCode,
		country,
		isDefault,
	} = data;

	// Look for order.customerId to get not authenticated user
	const orderFound = await db.query.order.findFirst({
		where: eq(order.id, orderId),
	});

	if (!orderFound) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.ORDER_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	if (!orderFound.customerId) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.ORDER_HAS_NO_CUSTOMER), {
			status: HTTP_CODES.BAD_REQUEST,
		});
	}

	const customerFound = await db.query.customer.findFirst({
		where: eq(customer.id, orderFound.customerId),
	});

	if (!customerFound) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.CUSTOMER_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	const [createdCustomerAddress] = await db
		.insert(customerAddress)
		.values({
			customerId: orderFound.customerId,
			street,
			number,
			complement,
			neighborhood,
			city,
			state,
			zipCode,
			country,
			isDefault,
		})
		.returning();

	if (!createdCustomerAddress) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_CUSTOMER_ADDRESS),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}

	return NextResponse.json({
		customerAddress: createdCustomerAddress,
	});
}
