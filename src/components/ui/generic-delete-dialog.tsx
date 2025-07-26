"use client";

import { CircleAlertIcon, Loader2 } from "lucide-react";
import { useId, useState } from "react";

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

interface GenericDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	itemId: string;
	itemName: string;
	itemType: "produto" | "pedido" | "categoria";
	onConfirm: () => void;
	isLoading?: boolean;
	warningText?: string;
}

export function GenericDeleteDialog({
	open,
	onOpenChange,
	itemId,
	itemName,
	itemType,
	onConfirm,
	isLoading = false,
	warningText,
}: GenericDeleteDialogProps) {
	const id = useId();
	const [inputValue, setInputValue] = useState("");

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
		if (inputValue === itemName && !isLoading) {
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
							{warningText && (
								<span className="block mt-2 font-semibold text-destructive">
									{warningText}
								</span>
							)}
							<span className="block mt-2">
								Para confirmar, digite o nome do {itemType}:{" "}
								<span className="font-semibold text-foreground">
									{itemName}
								</span>
							</span>
						</DialogDescription>
					</DialogHeader>
				</div>

				<form className="space-y-5 mt-4" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<Label htmlFor={id}>Nome do {itemType}</Label>
						<Input
							id={id}
							type="text"
							placeholder={`Digite ${itemName} para confirmar`}
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							disabled={isLoading}
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
							disabled={inputValue !== itemName || isLoading}
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
