import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { customer } from "@/lib/db/schema";

const updateCustomerSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	phoneNumber: z.string(),
});

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ customerId: string }> },
) {
	const { customerId } = await params;
	const body = await request.json();

	const {
		success,
		error,
		data: validatedData,
	} = updateCustomerSchema.safeParse(body);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { firstName, lastName, phoneNumber } = validatedData;

	// Check if customer exists
	const existingCustomer = await db.query.customer.findFirst({
		where: eq(customer.id, customerId),
	});

	if (!existingCustomer) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.CUSTOMER_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	// Update customer
	const [updatedCustomer] = await db
		.update(customer)
		.set({
			firstName,
			lastName,
			phoneNumber,
		})
		.where(eq(customer.id, customerId))
		.returning();

	if (!updatedCustomer) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_CUSTOMER),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}

	return NextResponse.json({
		customer: updatedCustomer,
	});
}
