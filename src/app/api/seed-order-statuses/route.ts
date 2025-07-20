import { type NextRequest, NextResponse } from "next/server";
import { seedOrderStatuses } from "@/lib/actions/order-status";

export async function POST(_req: NextRequest) {
	try {
		// Seed order statuses
		const statusResult = await seedOrderStatuses();
		if (statusResult.error) {
			return NextResponse.json({ error: statusResult.error }, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			message: "Order statuses seeded successfully",
		});
	} catch (error) {
		console.error("Error seeding order statuses:", error);
		return NextResponse.json(
			{ error: "Failed to seed order statuses" },
			{ status: 500 },
		);
	}
}
