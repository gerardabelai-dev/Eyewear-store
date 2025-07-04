"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/lib/actions/order";
import { getProducts } from "@/lib/actions/product";
import type { Product } from "@/lib/db/schema";
import {
	Mail,
	MessageSquare,
	Phone,
	Plus,
	ShoppingCart,
	User,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OrderItem {
	productId: string;
	quantity: number;
	unitPrice: string;
	productName: string;
	productStock: number;
}

export function OrderCreationSheet() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [loadingProducts, setLoadingProducts] = useState(false);

	// Form state
	const [customerName, setCustomerName] = useState("");
	const [customerEmail, setCustomerEmail] = useState("");
	const [customerPhone, setCustomerPhone] = useState("");
	const [notes, setNotes] = useState("");
	const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

	// Product selection state
	const [selectedProductId, setSelectedProductId] = useState("");
	const [selectedQuantity, setSelectedQuantity] = useState(1);

	// Load products when sheet opens
	useEffect(() => {
		if (isOpen && products.length === 0) {
			loadProducts();
		}
	}, [isOpen, products.length]);

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

	const addProductToOrder = () => {
		if (!selectedProductId) {
			toast.error("Selecione um produto");
			return;
		}

		const product = products.find((p) => p.id === selectedProductId);
		if (!product) {
			toast.error("Produto não encontrado");
			return;
		}

		if (selectedQuantity <= 0) {
			toast.error("Quantidade deve ser maior que zero");
			return;
		}

		if (selectedQuantity > product.stock) {
			toast.error("Quantidade maior que o estoque disponível");
			return;
		}

		// Check if product is already in order
		const existingItem = orderItems.find(
			(item) => item.productId === selectedProductId,
		);
		if (existingItem) {
			toast.error("Produto já adicionado ao pedido");
			return;
		}

		const newItem: OrderItem = {
			productId: selectedProductId,
			quantity: selectedQuantity,
			unitPrice: product.price,
			productName: product.name,
			productStock: product.stock,
		};

		setOrderItems([...orderItems, newItem]);
		setSelectedProductId("");
		setSelectedQuantity(1);
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!customerName.trim()) {
			toast.error("Nome do cliente é obrigatório");
			return;
		}

		if (!customerEmail.trim()) {
			toast.error("E-mail do cliente é obrigatório");
			return;
		}

		if (orderItems.length === 0) {
			toast.error("Adicione pelo menos um produto ao pedido");
			return;
		}

		setIsLoading(true);
		try {
			const result = await createOrder({
				customerName: customerName.trim(),
				customerEmail: customerEmail.trim(),
				customerPhone: customerPhone.trim() || undefined,
				notes: notes.trim() || undefined,
				items: orderItems.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
					unitPrice: item.unitPrice,
				})),
			});

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Pedido criado com sucesso!");
				resetForm();
				setIsOpen(false);
			}
		} catch (error) {
			console.error("Error creating order:", error);
			toast.error("Erro ao criar pedido");
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setCustomerName("");
		setCustomerEmail("");
		setCustomerPhone("");
		setNotes("");
		setOrderItems([]);
		setSelectedProductId("");
		setSelectedQuantity(1);
	};

	const availableProducts = products.filter((p) => p.stock > 0);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Novo Pedido
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-[600px] sm:w-[700px] overflow-y-auto"
			>
				<SheetHeader>
					<SheetTitle>Criar Novo Pedido</SheetTitle>
					<SheetDescription>
						Preencha os dados do cliente e adicione os produtos desejados
					</SheetDescription>
				</SheetHeader>

				<form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
								<div>
									<Label htmlFor="customerName">Nome *</Label>
									<Input
										id="customerName"
										value={customerName}
										onChange={(e) => setCustomerName(e.target.value)}
										placeholder="Nome completo do cliente"
										required
									/>
								</div>
								<div>
									<Label htmlFor="customerEmail">E-mail *</Label>
									<Input
										id="customerEmail"
										type="email"
										value={customerEmail}
										onChange={(e) => setCustomerEmail(e.target.value)}
										placeholder="cliente@email.com"
										required
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="customerPhone">Telefone</Label>
								<Input
									id="customerPhone"
									value={customerPhone}
									onChange={(e) => setCustomerPhone(e.target.value)}
									placeholder="(11) 99999-9999"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Product Selection */}
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
									<Label htmlFor="product">Produto</Label>
									<Select
										value={selectedProductId}
										onValueChange={setSelectedProductId}
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione um produto" />
										</SelectTrigger>
										<SelectContent>
											{loadingProducts && (
												<SelectItem value="loading" disabled>
													Carregando produtos...
												</SelectItem>
											)}
											{availableProducts.map((product) => (
												<SelectItem key={product.id} value={product.id}>
													{product.name} - R${" "}
													{parseFloat(product.price).toLocaleString("pt-BR", {
														minimumFractionDigits: 2,
													})}{" "}
													(Est: {product.stock})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="quantity">Quantidade</Label>
									<Input
										id="quantity"
										type="number"
										min="1"
										value={selectedQuantity}
										onChange={(e) =>
											setSelectedQuantity(parseInt(e.target.value) || 1)
										}
										placeholder="1"
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
						</CardContent>
					</Card>

					{/* Order Items */}
					{orderItems.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Itens do Pedido</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{orderItems.map((item) => (
										<div
											key={item.productId}
											className="flex items-center justify-between p-3 border rounded-lg"
										>
											<div className="flex-1">
												<div className="font-medium">{item.productName}</div>
												<div className="text-sm text-muted-foreground">
													R${" "}
													{parseFloat(item.unitPrice).toLocaleString("pt-BR", {
														minimumFractionDigits: 2,
													})}{" "}
													x {item.quantity}
												</div>
											</div>
											<div className="flex items-center gap-2">
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
												<Badge variant="outline">
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
													onClick={() => removeProductFromOrder(item.productId)}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
								</div>
								<div className="mt-4 pt-4 border-t">
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
							<Textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Observações adicionais sobre o pedido..."
								rows={3}
							/>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className="flex gap-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
							className="flex-1"
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							disabled={isLoading || orderItems.length === 0}
							className="flex-1"
						>
							{isLoading ? "Criando..." : "Criar Pedido"}
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
}
