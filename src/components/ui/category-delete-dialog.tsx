"use client";

import { CircleAlertIcon, Loader2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categoryId?: string;
	subcategoryId?: string;
	itemName: string;
	itemType: "categoria" | "subcategoria";
	onConfirm: () => void;
	isLoading?: boolean;
}

export function CategoryDeleteDialog({
	open,
	onOpenChange,
	categoryId,
	subcategoryId,
	itemName,
	itemType,
	onConfirm,
	isLoading = false,
}: CategoryDeleteDialogProps) {
	const id = useId();
	const [inputValue, setInputValue] = useState("");
	const [productsCount, setProductsCount] = useState<number | null>(null);
	const [subcategoriesCount, setSubcategoriesCount] = useState<number | null>(
		null,
	);
	const [loadingCount, setLoadingCount] = useState(true);

	useEffect(() => {
		if (open) {
			setLoadingCount(true);

			// If deleting a category, get both products and subcategories count
			if (categoryId && itemType === "categoria") {
				fetch(`/api/categories/deletion?id=${categoryId}`)
					.then((response) => response.json())
					.then((result) => {
						if (result.data) {
							setProductsCount(result.data.productsCount);
							setSubcategoriesCount(result.data.subcategoriesCount);
						}
					})
					.catch(() => {
						toast.error("Erro ao verificar itens relacionados");
					})
					.finally(() => {
						setLoadingCount(false);
					});
			} else if (subcategoryId && itemType === "subcategoria") {
				// If deleting a subcategory, only get products count
				fetch(
					`/api/categories/deletion?id=${categoryId}&subcategoryId=${subcategoryId}`,
				)
					.then((response) => response.json())
					.then((result) => {
						if (result.data !== undefined) {
							setProductsCount(result.data);
							setSubcategoriesCount(null);
						}
					})
					.catch(() => {
						toast.error("Erro ao verificar produtos relacionados");
					})
					.finally(() => {
						setLoadingCount(false);
					});
			}
		} else {
			setInputValue("");
			setProductsCount(null);
			setSubcategoriesCount(null);
		}
	}, [open, categoryId, subcategoryId, itemType]);

	const handleConfirm = () => {
		onConfirm();
		setInputValue("");
	};

	const handleCancel = () => {
		onOpenChange(false);
		setInputValue("");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue === itemName && !isLoading && !loadingCount) {
			handleConfirm();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<div className="flex flex-col items-center gap-2">
					<CircleAlertIcon className="text-destructive opacity-80" size={16} />
					<DialogHeader>
						<DialogTitle className="sm:text-center">
							Confirmar exclusão de {itemType}
						</DialogTitle>
						<DialogDescription className="sm:text-center">
							Esta ação não pode ser desfeita.
							{loadingCount ? (
								<div className="block mt-2 space-y-2">
									<Skeleton className="h-4 w-48 mx-auto" />
									<Skeleton className="h-3 w-32 mx-auto" />
								</div>
							) : (
								<>
									{itemType === "categoria" && (productsCount || 0) > 0 && (
										<span className="block mt-2 font-semibold text-destructive">
											Atenção: {productsCount} produto
											{productsCount !== 1 ? "s" : ""}{" "}
											{productsCount !== 1
												? "ficarão sem categoria"
												: "ficará sem categoria"}{" "}
											após esta exclusão.
										</span>
									)}
									{itemType === "categoria" &&
										(subcategoriesCount || 0) > 0 && (
											<span className="block mt-1 font-semibold text-destructive">
												{subcategoriesCount} subcategoria
												{subcategoriesCount !== 1 ? "s" : ""}{" "}
												{subcategoriesCount !== 1
													? "serão excluídas"
													: "será excluída"}{" "}
												junto com esta categoria.
											</span>
										)}
									{itemType === "subcategoria" && (productsCount || 0) > 0 && (
										<span className="block mt-2 font-semibold text-destructive">
											Atenção: {productsCount} produto
											{productsCount !== 1 ? "s" : ""}{" "}
											{productsCount !== 1 ? "estão" : "está"} usando esta
											subcategoria.
										</span>
									)}
								</>
							)}
							<span className="block mt-2">
								Para confirmar, digite o nome da {itemType}:{" "}
								<span className="font-semibold text-foreground">
									{itemName}
								</span>
							</span>
						</DialogDescription>
					</DialogHeader>
				</div>

				<form className="space-y-5 mt-4" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<Label htmlFor={id}>Nome da {itemType}</Label>
						<Input
							id={id}
							type="text"
							placeholder={`Digite ${itemName} para confirmar`}
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							disabled={isLoading || loadingCount}
						/>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={handleCancel}
								disabled={isLoading}
							>
								Cancelar
							</Button>
						</DialogClose>
						<Button
							type="submit"
							variant="destructive"
							className="flex-1"
							disabled={inputValue !== itemName || isLoading || loadingCount}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Excluindo
								</>
							) : (
								"Excluir"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
