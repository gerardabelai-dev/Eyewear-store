import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { customer } from "@/lib/db/schema";

export async function GET() {
	const user = await getCurrentUser();

	if (!user) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.UNAUTHORIZED), {
			status: HTTP_CODES.UNAUTHORIZED,
		});
	}

	const customerFound = await db.query.customer.findFirst({
		where: eq(customer.userId, user.id),
	});

	if (!customerFound) {
		return NextResponse.json(mapErrorCodes(ERROR_CODES.CUSTOMER_NOT_FOUND), {
			status: HTTP_CODES.NOT_FOUND,
		});
	}

	return NextResponse.json({
		customer: {
			...customerFound,
			email: user.email,
			role: user.role,
		},
	});
}
