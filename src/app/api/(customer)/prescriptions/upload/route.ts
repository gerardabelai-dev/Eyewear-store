import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { HTTP_CODES } from "@/app/api/contants/http-codes";
import { mapErrorCodes } from "@/app/api/utils/map-error-codes";
import { env } from "@/lib/env";

const uploadPrescriptionSchema = z.object({
	orderId: z.string().min(1, "Order ID is required"),
	cartProductId: z.string().min(1, "Cart Product ID is required"),
	filename: z.string().min(1, "Filename is required"),
});

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"image/heic",
];

export async function POST(request: Request) {
	try {
		// Parse form data
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const orderId = formData.get("orderId") as string;
		const cartProductId = formData.get("cartProductId") as string;

		if (!file) {
			return NextResponse.json(mapErrorCodes("PRESCRIPTION_UPLOAD_FAILED"), {
				status: HTTP_CODES.BAD_REQUEST,
			});
		}

		// Validate file size
		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(mapErrorCodes("PRESCRIPTION_UPLOAD_FAILED"), {
				status: HTTP_CODES.BAD_REQUEST,
			});
		}

		// Validate file type
		if (!ALLOWED_FILE_TYPES.includes(file.type)) {
			return NextResponse.json(mapErrorCodes("PRESCRIPTION_UPLOAD_FAILED"), {
				status: HTTP_CODES.BAD_REQUEST,
			});
		}

		// Validate schema
		const { success, data } = uploadPrescriptionSchema.safeParse({
			orderId,
			cartProductId,
			filename: file.name,
		});

		if (!success) {
			return NextResponse.json(mapErrorCodes("PRESCRIPTION_UPLOAD_FAILED"), {
				status: HTTP_CODES.BAD_REQUEST,
			});
		}

		// Generate file path: prescriptions/{orderId}_{cartProductId}_{original_filename}
		const _fileExtension = file.name.split(".").pop();
		const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
		const blobPath = `prescriptions/${data.orderId}_${data.cartProductId}_${sanitizedFilename}`;

		// Upload to Vercel Blob
		const blob = await put(blobPath, file, {
			access: "public",
			token: env.BLOB_READ_WRITE_TOKEN,
		});

		console.log("✅ Prescription uploaded successfully:", {
			orderId: data.orderId,
			cartProductId: data.cartProductId,
			blobUrl: blob.url,
			size: file.size,
			type: file.type,
		});

		return NextResponse.json({
			url: blob.url,
			fileName: file.name,
			fileSize: file.size,
			uploadedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("❌ Error uploading prescription:", error);
		return NextResponse.json(
			mapErrorCodes(ERROR_CODES.FAILED_TO_UPLOAD_PRESCRIPTION),
			{ status: HTTP_CODES.INTERNAL_SERVER_ERROR },
		);
	}
}
