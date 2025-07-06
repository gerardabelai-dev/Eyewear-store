"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Edit,
	ImageOff,
	MessageSquare,
	Plus,
	ShoppingCart,
	User,
	X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ProductForm } from "@/components/forms/product-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createOrder, updateOrder } from "@/lib/actions/order";
import { getProducts } from "@/lib/actions/product";
import type { Order, Product } from "@/lib/db/schema";

const orderItemSchema = z.object({
	productId: z.string().min(1, "Produto é obrigatório"),
	quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
	unitPrice: z.string().refine((val) => {
		const num = parseFloat(val);
		return !Number.isNaN(num) && num > 0;
	}, "Preço deve ser um valor válido maior que 0"),
});

const orderFormSchema = z.object({
	customerName: z
		.string()
		.min(1, "Nome do cliente é obrigatório")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
	customerEmail: z
		.string()
		.email("E-mail inválido")
		.max(100, "E-mail deve ter no máximo 100 caracteres"),
	customerPhone: z
		.string()
		.max(20, "Telefone deve ter no máximo 20 caracteres")
		.optional(),
	notes: z
		.string()
		.max(500, "Observações devem ter no máximo 500 caracteres")
		.optional(),
	items: z.array(orderItemSchema),
	// Temporary fields for product selection validation (only for new orders)
	selectedProduct: z.string().optional(),
	selectedQuantity: z
		.number()
		.min(1, "Quantidade deve ser maior que 0")
		.optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface OrderItem {
	productId: string;
	quantity: number;
	unitPrice: string;
	productName: string;
	productStock: number;
	productDescription?: string;
	productImages?: string[];
	categoryName?: string;
	subcategoryName?: string;
}

interface OrderFormProps {
	onSuccess?: () => void;
	order?: Order & {
		items?: OrderItem[];
	};
}

// Product Images Component for Order Items
function ProductImageDisplay({ images }: { images: string[] | undefined }) {
	if (!images || images.length === 0) {
		return (
			<div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
				<ImageOff className="h-6 w-6 text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="relative h-12 w-12 overflow-hidden rounded-md">
			<Image
				src={images[0]}
				alt="Produto"
				className="h-full w-full object-cover"
				width={48}
				height={48}
			/>
			{images.length > 1 && (
				<div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
					{images.length}
				</div>
			)}
		</div>
	);
}

export function OrderForm({ onSuccess, order }: OrderFormProps) {
	const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [loadingProducts, setLoadingProducts] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);

	const isEditing = !!order;

	const form = useForm<OrderFormData>({
		resolver: zodResolver(orderFormSchema),
		defaultValues: {
			customerName: order?.customerName || "",
			customerEmail: order?.customerEmail || "",
			customerPhone: order?.customerPhone || "",
			notes: order?.notes || "",
			items: [],
			selectedProduct: "",
			selectedQuantity: 1,
		},
	});

	// Load products and set up order items
	useEffect(() => {
		const loadProducts = async () => {
			setLoadingProducts(true);
			try {
				const result = await getProducts();
				if (result.error) {
					toast.error("Erro ao carregar produtos");
				} else {
					setProducts(result.data || []);
				}
			} catch (error) {
				console.error("Error loading products:", error);
				toast.error("Erro ao carregar produtos");
			} finally {
				setLoadingProducts(false);
			}
		};

		loadProducts();
	}, []);

	// Set up order items when products are loaded or order changes
	useEffect(() => {
		if (order?.items && products.length > 0) {
			const mappedItems: OrderItem[] = order.items.map((item) => {
				const product = products.find((p) => p.id === item.productId);
				return {
					...item,
					productStock: product?.stock || 0,
				};
			});
			setOrderItems(mappedItems);
		}
	}, [order, products]);

	// Update form items when orderItems change
	useEffect(() => {
		form.setValue("items", orderItems);
	}, [orderItems, form]);

	// Clear items error when user selects a product (only for new orders)
	useEffect(() => {
		if (!isEditing) {
			const subscription = form.watch((value, { name }) => {
				if (name === "selectedProduct" && value.selectedProduct) {
					form.clearErrors("items");
				}
			});
			return () => subscription.unsubscribe();
		}
	}, [form, isEditing]);

	const addProductToOrder = () => {
		const selectedProductId = form.getValues("selectedProduct");
		const selectedQuantity = form.getValues("selectedQuantity");

		// Clear any previous errors
		form.clearErrors("selectedProduct");
		form.clearErrors("selectedQuantity");

		if (!selectedProductId) {
			form.setError("selectedProduct", {
				type: "manual",
				message: "Selecione um produto",
			});
			return;
		}

		const product = products.find((p) => p.id === selectedProductId);
		if (!product) {
			form.setError("selectedProduct", {
				type: "manual",
				message: "Produto não encontrado",
			});
			return;
		}

		if (!selectedQuantity || selectedQuantity <= 0) {
			form.setError("selectedQuantity", {
				type: "manual",
				message: "Quantidade deve ser maior que zero",
			});
			return;
		}

		if (selectedQuantity > product.stock) {
			form.setError("selectedQuantity", {
				type: "manual",
				message: "Quantidade maior que o estoque disponível",
			});
			return;
		}

		// Check if product is already in order
		const existingItem = orderItems.find(
			(item) => item.productId === selectedProductId,
		);
		if (existingItem) {
			form.setError("selectedProduct", {
				type: "manual",
				message: "Produto já adicionado ao pedido",
			});
			return;
		}

		const newItem: OrderItem = {
			productId: selectedProductId,
			quantity: selectedQuantity,
			unitPrice: product.price,
			productName: product.name,
			productStock: product.stock,
			productDescription: product.description || undefined,
			productImages: product.images || undefined,
		};

		setOrderItems([...orderItems, newItem]);
		form.setValue("selectedProduct", "");
		form.setValue("selectedQuantity", 1);
		toast.success("Produto adicionado ao pedido");
	};

	const removeProductFromOrder = (productId: string) => {
		setOrderItems(orderItems.filter((item) => item.productId !== productId));
		toast.success("Produto removido do pedido");
	};

	const updateItemQuantity = (productId: string, newQuantity: number) => {
		const item = orderItems.find((item) => item.productId === productId);
		if (!item) return;

		if (newQuantity <= 0) {
			removeProductFromOrder(productId);
			return;
		}

		if (newQuantity > item.productStock) {
			toast.error("Quantidade maior que o estoque disponível");
			return;
		}

		setOrderItems(
			orderItems.map((item) =>
				item.productId === productId
					? { ...item, quantity: newQuantity }
					: item,
			),
		);
	};

	const calculateTotal = () => {
		return orderItems.reduce((total, item) => {
			return total + parseFloat(item.unitPrice) * item.quantity;
		}, 0);
	};

	const onSubmit = async (data: OrderFormData) => {
		try {
			// For new orders, ensure we have products added
			if (!isEditing && orderItems.length === 0) {
				// Set form error on product selection
				form.setError("selectedProduct", {
					type: "manual",
					message: "Selecione um produto",
				});
				// Show toast error message
				toast.error("Adicione pelo menos um produto para criar o pedido");
				return;
			}

			// Exclude temporary fields from the data
			const { selectedProduct, selectedQuantity, ...orderData } = data;

			let result: { error?: string; success?: string };
			if (order) {
				// Update existing order
				result = await updateOrder({
					id: order.id,
					...orderData,
				});
			} else {
				// Create new order
				result = await createOrder(orderData);
			}

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(
					order
						? "Pedido atualizado com sucesso!"
						: "Pedido criado com sucesso!",
				);
				onSuccess?.();
			}
		} catch (error) {
			console.error("Error saving order:", error);
			toast.error("Erro ao salvar pedido");
		}
	};

	const availableProducts = products.filter((p) => p.stock > 0);

	const openProductEdit = (productId: string) => {
		const product = products.find((p) => p.id === productId);
		if (product) {
			setEditingProduct(product);
		}
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Customer Information */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<User className="h-5 w-5" />
								Dados do Cliente
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="customerName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nome *</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Nome completo do cliente"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="customerEmail"
									render={({ field }) => (
										<FormItem>
											<FormLabel>E-mail *</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="email"
													placeholder="cliente@email.com"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="customerPhone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Telefone</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder="(11) 99999-9999"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Product Selection - Only show for new orders */}
					{!isEditing && (
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<ShoppingCart className="h-5 w-5" />
									Adicionar Produtos
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-3 gap-4">
									<div className="col-span-2">
										<FormField
											control={form.control}
											name="selectedProduct"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Produto</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Selecione um produto" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{loadingProducts && (
																<SelectItem value="loading" disabled>
																	Carregando produtos...
																</SelectItem>
															)}
															{availableProducts.map((product) => (
																<SelectItem key={product.id} value={product.id}>
																	{product.name} - R${" "}
																	{parseFloat(product.price).toLocaleString(
																		"pt-BR",
																		{
																			minimumFractionDigits: 2,
																		},
																	)}{" "}
																	(Est: {product.stock})
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div>
										<FormField
											control={form.control}
											name="selectedQuantity"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Quantidade</FormLabel>
													<FormControl>
														<Input
															type="number"
															min="1"
															{...field}
															onChange={(e) =>
																field.onChange(parseInt(e.target.value) || 1)
															}
															placeholder="1"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
								<Button
									type="button"
									onClick={addProductToOrder}
									variant="outline"
									className="w-full"
								>
									<Plus className="mr-2 h-4 w-4" />
									Adicionar ao Pedido
								</Button>

								{/* Items validation message */}
								<FormField
									control={form.control}
									name="items"
									render={() => (
										<FormItem>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
					)}

					{/* Order Items */}
					{orderItems.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Itens do Pedido</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{orderItems.map((item) => (
										<div
											key={item.productId}
											className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
										>
											{/* Mobile: Image and Product Info Row */}
											<div className="flex items-start gap-3 flex-1">
												{/* Product Image */}
												<div
													className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
													onClick={() => openProductEdit(item.productId)}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault();
															openProductEdit(item.productId);
														}
													}}
													tabIndex={0}
													role="button"
													aria-label={`Editar produto ${item.productName}`}
												>
													<ProductImageDisplay images={item.productImages} />
												</div>

												{/* Product Info */}
												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between gap-2 mb-2">
														<button
															type="button"
															onClick={() => openProductEdit(item.productId)}
															onKeyDown={(e) => {
																if (e.key === "Enter" || e.key === " ") {
																	e.preventDefault();
																	openProductEdit(item.productId);
																}
															}}
															className="font-medium text-left hover:text-primary transition-colors cursor-pointer flex-1"
														>
															{item.productName}
														</button>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => openProductEdit(item.productId)}
															className="h-6 w-6 p-0 flex-shrink-0"
														>
															<Edit className="h-3 w-3" />
														</Button>
													</div>

													<div className="flex flex-wrap items-center gap-2 mb-2">
														<span className="text-xs text-muted-foreground">
															ID: {item.productId.slice(-8)}
														</span>
														{item.categoryName && (
															<Badge variant="secondary" className="text-xs">
																{item.categoryName}
																{item.subcategoryName &&
																	` > ${item.subcategoryName}`}
															</Badge>
														)}
													</div>

													<div className="text-sm text-muted-foreground mb-2">
														R${" "}
														{parseFloat(item.unitPrice).toLocaleString(
															"pt-BR",
															{
																minimumFractionDigits: 2,
															},
														)}{" "}
														x {item.quantity}
													</div>

													{item.productDescription && (
														<p className="text-xs text-muted-foreground line-clamp-2">
															{item.productDescription}
														</p>
													)}
												</div>
											</div>

											{/* Mobile: Controls Row */}
											<div className="flex items-center justify-between sm:justify-end gap-2 sm:flex-shrink-0">
												<div className="flex items-center gap-2">
													<label className="text-sm font-medium sm:hidden">
														Qtd:
													</label>
													<Input
														type="number"
														min="1"
														max={item.productStock}
														value={item.quantity}
														onChange={(e) =>
															updateItemQuantity(
																item.productId,
																parseInt(e.target.value) || 0,
															)
														}
														className="w-20"
													/>
												</div>
												<div className="flex items-center gap-2">
													<Badge variant="outline" className="min-w-fit">
														R${" "}
														{(
															parseFloat(item.unitPrice) * item.quantity
														).toLocaleString("pt-BR", {
															minimumFractionDigits: 2,
														})}
													</Badge>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() =>
															removeProductFromOrder(item.productId)
														}
														className="text-destructive hover:text-destructive"
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
								<div className="mt-6 pt-4 border-t">
									<div className="flex justify-between items-center font-bold text-lg">
										<span>Total:</span>
										<span>
											R${" "}
											{calculateTotal().toLocaleString("pt-BR", {
												minimumFractionDigits: 2,
											})}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Notes */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<MessageSquare className="h-5 w-5" />
								Observações
							</CardTitle>
						</CardHeader>
						<CardContent>
							<FormField
								control={form.control}
								name="notes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Observações do Pedido</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												value={field.value || ""}
												placeholder="Adicione observações sobre o pedido..."
												className="min-h-[100px]"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Submit Button */}
					<Button type="submit" className="w-full" size="lg">
						{order ? "Atualizar Pedido" : "Criar Pedido"}
					</Button>
				</form>
			</Form>

			{/* Product Edit Drawer */}
			{editingProduct && (
				<Drawer
					trigger={<button type="button" style={{ display: "none" }}></button>}
					title="Editar Produto"
					description="Edite as informações do produto."
					icon={<Edit className="h-5 w-5" />}
					open={!!editingProduct}
					onOpenChange={(open) => !open && setEditingProduct(null)}
				>
					<ProductForm
						product={editingProduct}
						onSuccess={() => {
							setEditingProduct(null);
							// Reload products to get updated information
							const loadProducts = async () => {
								try {
									const result = await getProducts();
									if (result.data) {
										setProducts(result.data);
									}
								} catch (error) {
									console.error("Error reloading products:", error);
								}
							};
							loadProducts();
						}}
					/>
				</Drawer>
			)}
		</>
	);
}
