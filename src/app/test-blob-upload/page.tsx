"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ui/image-upload";

export default function TestBlobUploadPage() {
	const [images, setImages] = useState<string[]>([]);

	return (
		<div className="container mx-auto p-8 max-w-4xl">
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold">Test Vercel Blob Upload</h1>
					<p className="text-muted-foreground">
						Esta página testa o upload de imagens para o Vercel Blob
					</p>
				</div>

				<div className="space-y-4">
					<h2 className="text-xl font-semibold">Upload de Imagens</h2>
					<ImageUpload value={images} onChange={setImages} maxFiles={5} />
				</div>

				{images.length > 0 && (
					<div className="space-y-2">
						<h3 className="text-lg font-medium">URLs das Imagens:</h3>
						<div className="space-y-1">
							{images.map((url, index) => (
								<div
									key={url}
									className="p-2 bg-muted rounded text-sm font-mono"
								>
									{index + 1}. {url}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
