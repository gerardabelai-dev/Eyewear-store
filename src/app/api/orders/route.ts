import { and, desc, eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDefaultOrderStatus } from "@/lib/actions/order-status";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { order, orderItem, orderStatus, product } from "@/lib/db/schema";
import { enqueueEmailJob } from "@/lib/qstash";
import { getOrderStatsQuery, getOrdersQuery } from "@/lib/queries/orders";

// Paste all schemas, generateOrderNumber, etc.
// For POST:
export async function POST(req: NextRequest) {
	try {
		const data = await req.json();
		const currentUser = await getCurrentUser();
		if (!currentUser)
			return NextResponse.json(
				{ error: "Usuário não autenticado" },
				{ status: 401 },
			);
		// Validate with createOrderSchema
		// Full logic: status, product validation, insert order, items, update stock, enqueue email
		// Return success
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}

export async function GET(req: NextRequest) {
	const user = await getCurrentUser();
	if (!user)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get("page") || "1");
	const limit = parseInt(searchParams.get("limit") || "10");
	if (searchParams.get("type") === "stats")
		return NextResponse.json(await getOrderStatsQuery(user.id));
	const orders = await getOrdersQuery(user.id, { page, limit });
	return NextResponse.json(orders);
}
