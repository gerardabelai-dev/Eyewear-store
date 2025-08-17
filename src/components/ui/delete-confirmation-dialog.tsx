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
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteConfirmationDialogProps {
	productId: string;
	productName: string;
	onConfirm: () => void;
	trigger: React.ReactNode;
	isLoading?: boolean;
}

export function DeleteConfirmationDialog({
	productId,
	onConfirm,
	trigger,
	isLoading = false,
}: DeleteConfirmationDialogProps) {
	const id = useId();
	const [inputValue, setInputValue] = useState("");
	const [open, setOpen] = useState(false);

	const handleConfirm = () => {
		onConfirm();
		setOpen(false);
		setInputValue("");
	};

	const handleCancel = () => {
		setOpen(false);
		setInputValue("");
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<div className="flex flex-col items-center gap-2">
					<CircleAlertIcon className="opacity-80" size={16} />
					<DialogHeader>
						<DialogTitle className="sm:text-center">
							Confirmação final
						</DialogTitle>
						<DialogDescription className="sm:text-center">
							Esta ação não pode ser desfeita. Para confirmar, digite o ID do
							produto <span className="text-foreground">{productId}</span>.
						</DialogDescription>
					</DialogHeader>
				</div>

				<form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
					<div className="*:not-first:mt-2">
						<Label htmlFor={id}>ID do Produto</Label>
						<Input
							id={id}
							type="text"
							placeholder={`Digite ${productId} para confirmar`}
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
							type="button"
							variant="destructive"
							className="flex-1"
							disabled={inputValue !== productId || isLoading}
							onClick={handleConfirm}
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
