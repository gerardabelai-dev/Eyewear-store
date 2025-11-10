"use client";

import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type FileWithPreview, useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";

type PrescriptionItemUploadProps = {
	productName: string;
	cartProductId: string;
	orderId: string;
	cartId: string;
	hasUpload: boolean;
	prescriptionFileName?: string | null;
	onUploadSuccess: () => void;
};

export function PrescriptionItemUpload({
	productName,
	cartProductId,
	orderId,
	cartId,
	hasUpload,
	prescriptionFileName,
	onUploadSuccess,
}: PrescriptionItemUploadProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadSuccess, setUploadSuccess] = useState(hasUpload);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const [fileState, fileActions] = useFileUpload({
		maxFiles: 1,
		maxSize: 5 * 1024 * 1024, // 5MB
		accept: "application/pdf,image/jpeg,image/png,image/heic",
		multiple: false,
		onFilesAdded: async (files: FileWithPreview[]) => {
			if (files.length === 0) {
				return;
			}

			const fileToUpload = files[0]?.file;

			if (!(fileToUpload instanceof File)) {
				return;
			}

			setIsUploading(true);
			setUploadError(null);

			try {
				// Step 1: Upload file to Vercel Blob
				const formData = new FormData();
				formData.append("file", fileToUpload);
				formData.append("orderId", orderId);
				formData.append("cartProductId", cartProductId);

				const uploadResponse = await fetch("/api/prescriptions/upload", {
					method: "POST",
					body: formData,
				});

				if (!uploadResponse.ok) {
					throw new Error("Failed to upload prescription file");
				}

				const uploadData = await uploadResponse.json();

				// Step 2: Attach prescription to cart product
				const attachResponse = await fetch(
					`/api/carts/${cartId}/products/${cartProductId}/prescription`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							prescriptionFileUrl: uploadData.url,
							prescriptionFileName: uploadData.fileName,
							prescriptionFileSize: uploadData.fileSize,
						}),
					},
				);

				if (!attachResponse.ok) {
					throw new Error("Failed to attach prescription to product");
				}

				setUploadSuccess(true);
				fileActions.clearFiles();
				onUploadSuccess();
			} catch (error) {
				console.error("Upload error:", error);
				setUploadError(
					error instanceof Error
						? error.message
						: "Erro ao fazer upload da receita",
				);
				fileActions.clearFiles();
			} finally {
				setIsUploading(false);
			}
		},
	});

	return (
		<div className="border rounded-lg p-4 space-y-3">
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1">
					<h4 className="font-medium text-sm">{productName}</h4>
					{uploadSuccess && prescriptionFileName ? (
						<p className="text-xs text-muted-foreground mt-1">
							Receita anexada: {prescriptionFileName}
						</p>
					) : null}
				</div>

				{uploadSuccess ? (
					<div className="flex items-center gap-2 text-green-600">
						<CheckCircle className="h-5 w-5" />
						<span className="text-sm font-medium">Enviado</span>
					</div>
				) : (
					<div className="flex items-center gap-2 text-amber-600">
						<AlertCircle className="h-5 w-5" />
						<span className="text-sm font-medium">Pendente</span>
					</div>
				)}
			</div>

			{!uploadSuccess ? (
				<div>
					<input {...fileActions.getInputProps()} className="hidden" />
					<div
						className={cn(
							"border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
							fileState.isDragging
								? "border-primary bg-primary/5"
								: "border-muted-foreground/25 hover:border-primary/50",
							isUploading && "opacity-50 pointer-events-none",
						)}
						onDragEnter={fileActions.handleDragEnter}
						onDragLeave={fileActions.handleDragLeave}
						onDragOver={fileActions.handleDragOver}
						onDrop={fileActions.handleDrop}
						onClick={fileActions.openFileDialog}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								fileActions.openFileDialog();
							}
						}}
						role="button"
						tabIndex={0}
					>
						<Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
						<p className="text-sm font-medium mb-1">
							Clique para selecionar ou arraste o arquivo
						</p>
						<p className="text-xs text-muted-foreground">
							PDF, JPG, PNG ou HEIC (máx. 5MB)
						</p>
					</div>

					{uploadError ? (
						<p className="text-sm text-destructive mt-2">{uploadError}</p>
					) : null}

					{fileState.errors.length > 0 ? (
						<div className="mt-2 space-y-1">
							{fileState.errors.map((error, index) => (
								<p key={index} className="text-sm text-destructive">
									{error}
								</p>
							))}
						</div>
					) : null}

					{isUploading ? (
						<p className="text-sm text-muted-foreground mt-2">
							Enviando receita...
						</p>
					) : null}
				</div>
			) : (
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						setUploadSuccess(false);
						fileActions.clearFiles();
					}}
				>
					Alterar receita
				</Button>
			)}
		</div>
	);
}
