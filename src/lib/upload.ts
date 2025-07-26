import type { PutBlobResult } from "@vercel/blob";

export interface UploadResult {
	success: boolean;
	data?: PutBlobResult;
	error?: string;
}

/**
 * Upload a file to Vercel Blob storage
 * @param file - The file to upload
 * @param type - The type of upload (products, avatars, etc.)
 */
export async function uploadFileToBlob(
	file: File,
	type: "products" | "avatars" = "products",
): Promise<UploadResult> {
	try {
		// Validate file type
		const allowedTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/webp",
			"image/gif",
		];
		if (!allowedTypes.includes(file.type)) {
			return {
				success: false,
				error:
					"Tipo de arquivo não suportado. Use apenas imagens (JPEG, PNG, WebP, GIF).",
			};
		}

		// Validate file size (4.5MB limit for server uploads)
		const maxSize = 4.5 * 1024 * 1024; // 4.5MB in bytes
		if (file.size > maxSize) {
			return {
				success: false,
				error: "Arquivo muito grande. O tamanho máximo é 4.5MB.",
			};
		}

		// Upload to our API endpoint
		const response = await fetch(
			`/api/upload/images?filename=${encodeURIComponent(file.name)}&type=${type}`,
			{
				method: "POST",
				body: file,
				headers: {
					"Content-Type": file.type,
				},
			},
		);

		if (!response.ok) {
			const errorData = await response.json();
			return {
				success: false,
				error: errorData.error || "Erro ao fazer upload do arquivo",
			};
		}

		const blob = (await response.json()) as PutBlobResult;
		return {
			success: true,
			data: blob,
		};
	} catch (error) {
		console.error("Upload error:", error);
		return {
			success: false,
			error: "Erro inesperado durante o upload",
		};
	}
}

/**
 * Upload multiple files to Vercel Blob storage
 */
export async function uploadMultipleFilesToBlob(files: File[]): Promise<{
	successful: PutBlobResult[];
	failed: { file: File; error: string }[];
}> {
	const successful: PutBlobResult[] = [];
	const failed: { file: File; error: string }[] = [];

	// Upload files in parallel
	const uploadPromises = files.map(async (file) => {
		const result = await uploadFileToBlob(file);
		if (result.success && result.data) {
			successful.push(result.data);
		} else {
			failed.push({ file, error: result.error || "Upload failed" });
		}
	});

	await Promise.all(uploadPromises);

	return { successful, failed };
}
