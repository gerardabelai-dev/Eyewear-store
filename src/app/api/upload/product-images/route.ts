import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(request.url);
		const filename = searchParams.get("filename");

		if (!filename) {
			return NextResponse.json(
				{ error: "Filename is required" },
				{ status: 400 },
			);
		}

		// Validate file type (only images)
		const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
		const contentType = request.headers.get("content-type") || "";

		if (!allowedTypes.some((type) => contentType.includes(type))) {
			return NextResponse.json(
				{ error: "Invalid file type. Only images are allowed." },
				{ status: 400 },
			);
		}

		// Check if request has body
		if (!request.body) {
			return NextResponse.json(
				{ error: "No file data provided" },
				{ status: 400 },
			);
		}

		// Generate unique filename with timestamp to avoid conflicts
		const timestamp = Date.now();
		const extension = filename.split(".").pop();
		const uniqueFilename = `products/${timestamp}-${filename}`;

		// Upload to Vercel Blob
		const blob = await put(uniqueFilename, request.body, {
			access: "public",
			token: serverEnv?.BLOB_READ_WRITE_TOKEN,
		});

		return NextResponse.json(blob);
	} catch (error) {
		console.error("Error uploading file:", error);
		return NextResponse.json(
			{ error: "Failed to upload file" },
			{ status: 500 },
		);
	}
}
