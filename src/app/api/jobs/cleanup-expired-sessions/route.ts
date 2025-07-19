import { lt } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { session } from "@/lib/db/schema";
import type { CleanupExpiredSessionsPayload } from "@/lib/qstash";
import { verifyQStashSignature } from "@/lib/qstash";

export async function POST(request: NextRequest) {
	try {
		// Get the request body and signature
		const body = await request.text();
		const signature = request.headers.get("upstash-signature");
		const url = request.url;

		// Verify QStash signature
		if (!signature) {
			console.error("Missing QStash signature");
			return NextResponse.json({ error: "Missing signature" }, { status: 401 });
		}

		const isValid = await verifyQStashSignature(signature, body, url);
		if (!isValid) {
			console.error("Invalid QStash signature");
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		// Parse the payload
		let payload: CleanupExpiredSessionsPayload;
		try {
			payload = JSON.parse(body);
		} catch (error) {
			console.error("Invalid JSON payload:", error);
			return NextResponse.json(
				{ error: "Invalid JSON payload" },
				{ status: 400 },
			);
		}

		// Validate required fields
		if (!payload.cutoffDate) {
			console.error("Missing required fields in payload:", payload);
			return NextResponse.json(
				{ error: "Missing required fields: cutoffDate" },
				{ status: 400 },
			);
		}

		console.log(`Cleaning up sessions expired before ${payload.cutoffDate}`);

		// Delete expired sessions
		const cutoffDateTime = new Date(payload.cutoffDate);
		const deletedSessions = await db
			.delete(session)
			.where(lt(session.expiresAt, cutoffDateTime))
			.returning({ id: session.id });

		const deletedCount = deletedSessions.length;

		console.log(`Cleaned up ${deletedCount} expired sessions`);

		return NextResponse.json({
			success: true,
			deletedCount,
			cutoffDate: payload.cutoffDate,
			message: `Successfully cleaned up ${deletedCount} expired sessions`,
		});
	} catch (error) {
		console.error("Error in cleanup-expired-sessions job:", error);

		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
