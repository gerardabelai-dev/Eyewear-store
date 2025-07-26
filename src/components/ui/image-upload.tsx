"use client";

import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadFileToBlob } from "@/lib/upload";

interface ImageUploadProps {
	value: string[];
	onChange: (urls: string[]) => void;
	maxFiles?: number;
	disabled?: boolean;
	onUploadingChange?: (uploading: boolean) => void;
}

export function ImageUpload({
	value = [],
	onChange,
	maxFiles = 5,
	disabled = false,
	onUploadingChange,
}: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			if (disabled) return;

			// Check if adding these files would exceed maxFiles
			if (value.length + acceptedFiles.length > maxFiles) {
				toast.error(`Máximo de ${maxFiles} imagens permitido`);
				return;
			}

			setUploading(true);
			onUploadingChange?.(true);
			const uploadPromises = acceptedFiles.map(async (file) => {
				const result = await uploadFileToBlob(file, "products");
				if (result.success && result.data) {
					return result.data.url;
				} else {
					toast.error(result.error || "Erro ao fazer upload");
					return null;
				}
			});

			try {
				const results = await Promise.all(uploadPromises);
				const successfulUrls = results.filter(
					(url): url is string => url !== null,
				);

				if (successfulUrls.length > 0) {
					onChange([...value, ...successfulUrls]);
					toast.success(
						`${successfulUrls.length} imagem(ns) enviada(s) com sucesso!`,
					);
				}
			} catch (error) {
				console.error("Upload error:", error);
				toast.error("Erro ao fazer upload das imagens");
			} finally {
				setUploading(false);
				onUploadingChange?.(false);
			}
		},
		[value, onChange, maxFiles, disabled, onUploadingChange],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
		},
		maxFiles: maxFiles - value.length,
		disabled: disabled || uploading,
	});

	const removeImage = (urlToRemove: string) => {
		onChange(value.filter((url) => url !== urlToRemove));
	};

	return (
		<div className="space-y-4">
			{/* Upload Area */}
			<div
				{...getRootProps()}
				className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
          ${disabled || uploading ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5"}
        `}
			>
				<input {...getInputProps()} />
				<div className="flex flex-col items-center gap-2">
					{uploading ? (
						<>
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
							<p className="text-sm text-muted-foreground">Fazendo upload...</p>
						</>
					) : (
						<>
							<Upload className="h-8 w-8 text-muted-foreground" />
							<div className="space-y-1">
								<p className="text-sm font-medium">
									{isDragActive
										? "Solte as imagens aqui"
										: "Arraste imagens aqui ou clique para selecionar"}
								</p>
								<p className="text-xs text-muted-foreground">
									PNG, JPG, WEBP até 4.5MB ({value.length}/{maxFiles})
								</p>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Image Preview Grid */}
			{value.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{value.map((url, index) => (
						<div key={url} className="relative group aspect-square">
							<Image
								src={url}
								alt={`Imagem ${index + 1}`}
								fill
								className="object-cover rounded-lg border"
								sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
							/>
							<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
								<Button
									type="button"
									variant="destructive"
									size="sm"
									onClick={() => removeImage(url)}
									disabled={disabled}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			{value.length === 0 && (
				<div className="text-center py-8 text-muted-foreground">
					<ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
					<p className="text-sm">Nenhuma imagem adicionada</p>
				</div>
			)}
		</div>
	);
}
