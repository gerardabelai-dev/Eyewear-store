import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import z from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { customer, user } from "@/lib/db/schema";

const createCustomerSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	phoneNumber: z.string(),
});

export async function POST(request: Request) {
	const body = await request.json();

	const { success, error, data } = createCustomerSchema.safeParse(body);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { firstName, lastName, email, phoneNumber } = data;

	const userAlreadyExists = await db.query.user.findFirst({
		where: eq(user.email, email),
	});

	if (userAlreadyExists) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.USER_ALREADY_EXISTS), {
			status: HTTP_CODES.BAD_REQUEST,
		});
	}

	const [userCreated] = await db
		.insert(user)
		.values({
			email,
			name: `${firstName} ${lastName}`,
		})
		.returning();

	if (!userCreated) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_USER), {
			status: HTTP_CODES.INTERNAL_SERVER_ERROR,
		});
	}

	const [customerCreated] = await db
		.insert(customer)
		.values({
			userId: userCreated.id,
			firstName,
			lastName,
			phoneNumber,
		})
		.returning();

	if (!customerCreated) {
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_CREATE_CUSTOMER),
			{
				status: HTTP_CODES.INTERNAL_SERVER_ERROR,
			},
		);
	}

	return NextResponse.json({
		customer: {
			id: customerCreated.id,
		},
	});
}
