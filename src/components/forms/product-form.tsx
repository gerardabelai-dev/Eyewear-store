"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircleIcon,
	ImageIcon,
	Package,
	UploadIcon,
	XIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CategoryForm } from "@/components/forms/category-form";
import { SubcategoryForm } from "@/components/forms/subcategory-form";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useFileUpload } from "@/hooks/use-file-upload";
import {
	getCategories,
	getSubcategoriesByCategory,
} from "@/lib/actions/category";
import { createProduct, updateProduct } from "@/lib/actions/product";
import type { Category, Product, Subcategory } from "@/lib/db/schema";

const productFormSchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
	description: z
		.string()
		.max(500, "Descrição deve ter no máximo 500 caracteres")
		.optional(),
	price: z.string().refine((val) => {
		const num = parseFloat(val);
		return !Number.isNaN(num) && num > 0;
	}, "Preço deve ser um valor válido maior que 0"),
	stock: z.string().refine((val) => {
		const num = parseInt(val);
		return !Number.isNaN(num) && num >= 0;
	}, "Estoque deve ser um número válido maior ou igual a 0"),
	status: z
		.enum(["active", "inactive", "draft", "discontinued"], {
			errorMap: () => ({ message: "Status inválido" }),
		})
		.optional()
		.default("active"),
	categoryId: z.string().min(1, "Categoria é obrigatória"),
	subcategoryId: z.string().optional(),
	images: z
		.array(z.string().url("URL da imagem inválida"))
		.max(6, "Máximo de 6 imagens permitidas")
		.optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
	onSuccess?: () => void;
	product?:
		| Product
		| (Product & { categoryName?: string; subcategoryName?: string }); // For edit mode
}

// Product Image Upload Component
function ProductImageUpload({
	onImagesChange,
	initialImages = [],
}: {
	onImagesChange: (images: string[]) => void;
	initialImages?: string[];
}) {
	const maxSizeMB = 5;
	const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
	const maxFiles = 6;

	// Convert initial image URLs to FileMetadata format
	const initialFiles = initialImages.map((url, index) => ({
		id: `existing-${index}-${Date.now()}`,
		name: `image-${index + 1}.jpg`,
		size: 0, // Unknown size for existing images
		type: "image/jpeg", // Assume jpeg for existing images
		url: url,
	}));

	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp",
		maxSize,
		multiple: true,
		maxFiles,
		initialFiles,
	});

	// Update images when files change - use useEffect to avoid setState during render
	useEffect(() => {
		// Convert files to URLs for form submission
		// In a real app, you'd upload these to a storage service and get URLs
		const imageUrls = files
			.map((file) => {
				if (file.preview) {
					return file.preview;
				}
				// For existing files that are already URLs
				if (typeof file.file === "object" && "url" in file.file) {
					return (file.file as any).url;
				}
				return "";
			})
			.filter(Boolean);

		onImagesChange(imageUrls);
	}, [files, onImagesChange]);

	return (
		<div className="space-y-2">
			<div
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				onClick={openFileDialog}
				data-dragging={isDragging || undefined}
				data-files={files.length > 0 || undefined}
				className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full"
				role="button"
				tabIndex={0}
				aria-label="Upload de imagens do produto"
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						openFileDialog();
					}
				}}
			>
				<input
					{...getInputProps()}
					className="sr-only"
					aria-label="Upload de imagens do produto"
				/>
				{files.length > 0 ? (
					<div className="w-full">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h3 className="text-sm font-medium">
									Imagens Enviadas ({files.length})
								</h3>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									openFileDialog();
								}}
								disabled={files.length >= maxFiles}
							>
								<UploadIcon
									className="-ms-0.5 size-3.5 opacity-60"
									aria-hidden="true"
								/>
								Adicionar mais
							</Button>
						</div>

						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{files.map((file) => (
								<div
									key={file.id}
									className="bg-accent relative aspect-square rounded-md"
								>
									<Image
										src={file.preview || "/placeholder.svg"}
										alt={
											file.file instanceof File
												? file.file.name
												: "Imagem do produto"
										}
										className="size-full rounded-[inherit] object-cover"
										width={200}
										height={200}
									/>
									<Button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											removeFile(file.id);
										}}
										size="icon"
										className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
										aria-label="Remover imagem"
									>
										<XIcon className="size-3" />
									</Button>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-3 text-center">
						<div className="bg-muted/50 rounded-full p-4">
							<ImageIcon className="text-muted-foreground size-8" />
						</div>
						<div>
							<p className="text-foreground text-sm">
								Arraste e solte imagens ou clique para selecionar
							</p>
							<p className="text-muted-foreground text-xs mt-1">
								PNG, JPG ou WEBP até {maxSizeMB}MB
							</p>
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								openFileDialog();
							}}
							className="mt-3"
						>
							Selecionar imagens
						</Button>
					</div>
				)}

				{errors.length > 0 && (
					<div
						className="text-destructive flex items-center gap-1 text-xs mt-2"
						role="alert"
					>
						<AlertCircleIcon className="size-3" />
						{errors[0]}
					</div>
				)}
			</div>
			<p className="text-muted-foreground text-xs text-center">
				Upload múltiplo de imagens ∙ Máximo {maxFiles} imagens
			</p>
		</div>
	);
}

export function ProductForm({ onSuccess, product }: ProductFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isImageUploading, setIsImageUploading] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
	const [showCategoryCreation, setShowCategoryCreation] = useState(false);
	const [showSubcategoryCreation, setShowSubcategoryCreation] = useState(false);
	const isEditing = !!product;

	const form = useForm({
		resolver: zodResolver(productFormSchema),
		defaultValues: {
			name: product?.name || "",
			description: product?.description || "",
			price: product?.price || "",
			stock: product?.stock?.toString() || "",
			status: (product as any)?.status || "active",
			categoryId: product?.categoryId || "",
			subcategoryId: product?.subcategoryId || "",
			images: product?.images || [],
		},
	});

	// Load categories on component mount
	useEffect(() => {
		async function loadCategories() {
			const result = await getCategories();
			if (result.data) {
				setCategories(result.data);
			}
		}
		loadCategories();
	}, []);

	// Load subcategories when category changes
	useEffect(() => {
		async function loadSubcategories() {
			if (selectedCategoryId) {
				const result = await getSubcategoriesByCategory(selectedCategoryId);
				if (result.data) {
					setSubcategories(result.data);
				}
			} else {
				setSubcategories([]);
			}
		}
		loadSubcategories();
	}, [selectedCategoryId]);

	// Set initial category if editing
	useEffect(() => {
		if (product?.categoryId) {
			setSelectedCategoryId(product.categoryId);
		}
	}, [product?.categoryId]);

	// Function to reload categories after creation
	const reloadCategories = async () => {
		const result = await getCategories();
		if (result.data) {
			setCategories(result.data);
		}
	};

	// Function to reload subcategories after creation
	const reloadSubcategories = async () => {
		if (selectedCategoryId) {
			const result = await getSubcategoriesByCategory(selectedCategoryId);
			if (result.data) {
				setSubcategories(result.data);
			}
		}
	};

	async function onSubmit(data: ProductFormData) {
		setIsSubmitting(true);
		try {
			const result = isEditing
				? await updateProduct({ ...data, id: product.id })
				: await createProduct(data);

			if (result.error) {
				console.error(result.error);
			} else {
				if (!isEditing) {
					form.reset();
				}
				onSuccess?.();
			}
		} catch (error) {
			console.error(
				`Erro ao ${isEditing ? "atualizar" : "criar"} produto:`,
				error,
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, (errors) => {
						console.error("Form validation errors:", errors);
						toast.error(
							"Por favor, verifique os campos destacados e tente novamente.",
						);
					})}
					className="space-y-6"
				>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome do Produto</FormLabel>
									<FormControl>
										<Input placeholder="Ex: iPhone 15 Pro" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição (Opcional)</FormLabel>
									<FormControl>
										<Input placeholder="Descreva seu produto..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-4">
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Preço (R$)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												min="0"
												placeholder="99.99"
												className="w-full"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="stock"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Estoque</FormLabel>
										<FormControl>
											<Input
												type="number"
												min="0"
												placeholder="10"
												className="w-full"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<SearchableSelect
										options={categories.map((category) => ({
											value: category.id,
											label: category.name,
										}))}
										value={field.value}
										onValueChange={(value) => {
											field.onChange(value);
											setSelectedCategoryId(value);
											// Reset subcategory when category changes
											form.setValue("subcategoryId", "");
										}}
										label="Categoria *"
										placeholder="Selecione uma categoria"
										searchPlaceholder="Buscar categorias..."
										emptyText="Nenhuma categoria encontrada."
										addNewText="Nova Categoria"
										showAddNew={true}
										onAddNew={() => setShowCategoryCreation(true)}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>

						{selectedCategoryId && (
							<FormField
								control={form.control}
								name="subcategoryId"
								render={({ field }) => (
									<FormItem>
										<SearchableSelect
											options={[
												{
													value: "",
													label: "Nenhuma subcategoria",
												},
												...subcategories.map((subcategory) => ({
													value: subcategory.id,
													label: subcategory.name,
												})),
											]}
											value={field.value || ""}
											onValueChange={field.onChange}
											label="Subcategoria (Opcional)"
											placeholder="Selecione uma subcategoria"
											searchPlaceholder="Buscar subcategorias..."
											emptyText="Nenhuma subcategoria encontrada."
											addNewText="Nova Subcategoria"
											showAddNew={true}
											onAddNew={() => setShowSubcategoryCreation(true)}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<Separator />

						<FormField
							control={form.control}
							name="images"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Imagens do Produto</FormLabel>
									<FormControl>
										<ImageUpload
											value={field.value || []}
											onChange={field.onChange}
											maxFiles={5}
											onUploadingChange={setIsImageUploading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button
						type="submit"
						disabled={isSubmitting || isImageUploading}
						className="w-full"
					>
						{isSubmitting
							? isEditing
								? "Atualizando produto..."
								: "Criando produto..."
							: isEditing
								? "Atualizar Produto"
								: "Criar Produto"}
					</Button>
				</form>
			</Form>
			{showCategoryCreation && (
				<Drawer
					trigger={<button type="button" style={{ display: "none" }}></button>}
					title="Nova Categoria"
					description="Preencha as informações para criar uma nova categoria."
					icon={<Package className="h-5 w-5" />}
					open={showCategoryCreation}
					onOpenChange={(open) => !open && setShowCategoryCreation(false)}
				>
					<CategoryForm
						onSuccess={() => {
							setShowCategoryCreation(false);
							reloadCategories();
						}}
					/>
				</Drawer>
			)}

			{/* Subcategory Creation Drawer */}
			{showSubcategoryCreation && selectedCategoryId && (
				<Drawer
					trigger={<button type="button" style={{ display: "none" }}></button>}
					title="Nova Subcategoria"
					description="Preencha as informações para criar uma nova subcategoria."
					icon={<Package className="h-5 w-5" />}
					open={showSubcategoryCreation}
					onOpenChange={(open) => !open && setShowSubcategoryCreation(false)}
				>
					<SubcategoryForm
						categoryId={selectedCategoryId}
						onSuccess={() => {
							setShowSubcategoryCreation(false);
							reloadSubcategories();
						}}
					/>
				</Drawer>
			)}
		</>
	);
}
