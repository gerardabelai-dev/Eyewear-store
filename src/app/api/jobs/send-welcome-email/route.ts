import { type NextRequest, NextResponse } from "next/server";
import type { SendWelcomeEmailPayload } from "@/lib/qstash";
import { verifyQStashSignature } from "@/lib/qstash";
import { sendWelcomeEmail } from "@/lib/resend";

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
		let payload: SendWelcomeEmailPayload;
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
		if (!payload.email || !payload.name || !payload.userId) {
			console.error("Missing required fields in payload:", payload);
			return NextResponse.json(
				{ error: "Missing required fields: email, name, userId" },
				{ status: 400 },
			);
		}

		// Send the welcome email
		console.log(
			`Sending welcome email to ${payload.email} for user ${payload.userId}`,
		);

		const result = await sendWelcomeEmail({
			name: payload.name,
			email: payload.email,
			unsubscribeUrl: payload.unsubscribeUrl,
		});

		console.log(
			`Welcome email sent successfully to ${payload.email}:`,
			result.data,
		);

		return NextResponse.json({
			success: true,
			messageId: result.messageId,
			userId: payload.userId,
		});
	} catch (error) {
		console.error("Error in send-welcome-email job:", error);

		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
