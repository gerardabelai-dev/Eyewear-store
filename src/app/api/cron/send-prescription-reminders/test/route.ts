import { NextResponse } from "next/server";

/**
 * Development-only test endpoint for cron job
 * DO NOT USE IN PRODUCTION
 */
export async function GET() {
	// Only allow in development
	if (process.env.NODE_ENV === "production") {
		return NextResponse.json(
			{ error: "This endpoint is only available in development" },
			{ status: 403 },
		);
	}

	console.log("🧪 Testing cron job endpoint (development only)...");

	try {
		// Call the actual cron endpoint
		const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
		const response = await fetch(
			`${baseUrl}/api/cron/send-prescription-reminders`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.CRON_SECRET || "dev-secret"}`,
				},
			},
		);

		const data = await response.json();

		return NextResponse.json({
			message: "Test completed",
			cronResponse: data,
			status: response.status,
		});
	} catch (error) {
		console.error("Test failed:", error);
		return NextResponse.json(
			{
				error: "Test failed",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
