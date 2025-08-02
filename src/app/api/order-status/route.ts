import { NextResponse } from "next/server";
import { getOrderStatusesQuery } from "@/lib/queries/order-status";

export async function GET() {
	const statuses = await getOrderStatusesQuery();
	return NextResponse.json(statuses);
}
