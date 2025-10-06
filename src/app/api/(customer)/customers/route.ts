import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { mapInvalidZodResponse } from "@/app/api/utils/map-invalid-zod-response";
import { db } from "@/lib/db";
import { customer, user } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend/client";
import CompleteRegistrationEmail from "../../../../../emails/complete-registration";

const createCustomerSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	phoneNumber: z.string(),
});

export async function POST(request: Request) {
	const body = await request.json();

	const {
		success,
		error,
		data: validatedData,
	} = createCustomerSchema.safeParse(body);

	if (!success) {
		return mapInvalidZodResponse(error);
	}

	const { firstName, lastName, email, phoneNumber } = validatedData;

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

	// Send complete registration email with reset password link
	const resetPasswordUrl = `${env.WEB_URL}/reset-password`;

	const { data, error: emailError } = await resend.emails.send({
		from: "Dr. Vista <onboarding@resend.dev>",
		to: ["delivered@resend.dev"],
		subject: "Bem-vindo à Dr. Vista! Complete seu cadastro.",
		react: CompleteRegistrationEmail({
			customerName: firstName,
			resetPasswordUrl,
		}),
	});

	if (emailError) {
		console.error("Error sending complete registration email:", emailError);
	}

	if (data) {
		console.log("Complete registration email sent successfully:", data);
	}

	return NextResponse.json({
		customer: customerCreated,
	});
}
