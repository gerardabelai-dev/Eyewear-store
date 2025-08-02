"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { UserAvatar } from "@/components/ui/user-avatar";
import { uploadFileToBlob } from "@/lib/upload";

// Since file uploads are handled differently, we'll use a simpler schema
const avatarSchema = z.object({
	// This will be used to track if we want to submit the form
	ready: z.boolean(),
});

type AvatarFormData = z.infer<typeof avatarSchema>;

interface AvatarFormProps {
	userImage?: string | null;
	userInitials: string;
}

export function AvatarForm({ userImage, userInitials }: AvatarFormProps) {
	const [isPending, startTransition] = useTransition();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const form = useForm<AvatarFormData>({
		resolver: zodResolver(avatarSchema),
		defaultValues: {
			ready: true,
		},
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("A imagem deve ter no máximo 5MB");
				return;
			}

			if (!file.type.startsWith("image/")) {
				toast.error("Por favor, selecione apenas arquivos de imagem");
				return;
			}

			setImage(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const removeImage = () => {
		setImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const onSubmit = (_data: AvatarFormData) => {
		if (!image) {
			toast.error("Por favor, selecione uma imagem");
			return;
		}

		startTransition(async () => {
			try {
				// Upload to blob storage first
				const uploadResult = await uploadFileToBlob(image, "avatars");

				if (!uploadResult.success || !uploadResult.data) {
					toast.error(uploadResult.error || "Erro ao fazer upload da imagem");
					return;
				}

				// Update user avatar with the blob URL
				const response = await fetch("/api/user/avatar", {
					method: "PATCH",
					body: JSON.stringify({ image: uploadResult.data.url }),
				});
				const result = await response.json();

				if (result.error) {
					toast.error(result.error);
				} else if (result.success) {
					toast.success(result.success);
					// Reset the image selection after successful upload
					removeImage();
				}
			} catch (error) {
				toast.error("Erro ao fazer upload da imagem");
				console.error("Erro ao fazer upload:", error);
			}
		});
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex justify-between items-start mb-6">
					<div>
						<h3 className="text-lg font-semibold mb-2">Foto do Perfil</h3>
						<p className="text-muted-foreground">
							Faça upload de uma foto para personalizar seu perfil.
						</p>
					</div>
				</div>

				<div className="flex flex-col items-center gap-6">
					{/* Avatar Preview */}
					<div className="relative shrink-0">
						<UserAvatar
							userImage={imagePreview || userImage}
							userInitials={userInitials}
							size="xl"
						/>
						{imagePreview && (
							<button
								type="button"
								onClick={removeImage}
								className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
							>
								<X className="w-3 h-3" />
							</button>
						)}
					</div>

					{/* Upload Controls */}
					<div className="flex-1 w-full text-center">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>

						<div className="flex flex-col items-center gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={() => fileInputRef.current?.click()}
								className="flex items-center gap-2"
							>
								<Upload className="w-4 h-4" />
								{userImage || imagePreview ? "Alterar" : "Upload"}
							</Button>

							{image && (
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit, (errors) => {
											console.error("Form validation errors:", errors);
											toast.error(
												"Por favor, verifique os campos destacados e tente novamente.",
											);
										})}
									>
										<FormField
											control={form.control}
											name="ready"
											render={() => (
												<FormItem>
													<FormControl>
														<Button type="submit" disabled={isPending}>
															{isPending ? (
																<>
																	<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																	Salvando
																</>
															) : (
																"Salvar"
															)}
														</Button>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</form>
								</Form>
							)}
						</div>

						<p className="text-xs text-muted-foreground mt-2">
							PNG, JPG, GIF até 5MB
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
