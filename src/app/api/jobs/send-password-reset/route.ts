import { type NextRequest, NextResponse } from "next/server";
import type { SendPasswordResetPayload } from "@/lib/qstash";
import { verifyQStashSignature } from "@/lib/qstash";
import { sendPasswordResetEmail } from "@/lib/resend";

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
		let payload: SendPasswordResetPayload;
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
		if (!payload.email || !payload.resetToken) {
			console.error("Missing required fields in payload:", payload);
			return NextResponse.json(
				{ error: "Missing required fields: email, resetToken" },
				{ status: 400 },
			);
		}

		// Send the password reset email
		console.log(`Sending password reset email to ${payload.email}`);

		// Construct the reset URL from the token
		const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${payload.resetToken}`;

		const result = await sendPasswordResetEmail(
			{
				name: payload.name,
				resetUrl: resetUrl,
				unsubscribeUrl: payload.unsubscribeUrl,
			},
			payload.email,
		);

		console.log(
			`Password reset email sent successfully to ${payload.email}:`,
			result.data,
		);

		return NextResponse.json({
			success: true,
			messageId: result.messageId,
			email: payload.email,
		});
	} catch (error) {
		console.error("Error in send-password-reset job:", error);

		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
