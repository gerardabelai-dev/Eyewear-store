"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
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
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const deleteAccountSchema = z
	.object({
		confirmation: z.string().min(1, "Este campo é obrigatório"),
	})
	.refine((data) => data.confirmation === "DELETAR", {
		message: "Digite 'DELETAR' para confirmar",
		path: ["confirmation"],
	});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

export function DeleteAccountForm() {
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [isPending, startTransition] = useTransition();

	const form = useForm<DeleteAccountFormData>({
		resolver: zodResolver(deleteAccountSchema),
		defaultValues: {
			confirmation: "",
		},
	});

	const onSubmit = (_data: DeleteAccountFormData) => {
		startTransition(async () => {
			try {
				// TODO: Implement actual delete account functionality
				toast.success(
					"Funcionalidade de deletar conta será implementada em breve",
				);
				form.reset();
				setShowConfirmation(false);
			} catch (error) {
				toast.error("Erro ao deletar conta");
				console.error("Erro ao deletar conta:", error);
			}
		});
	};

	const handleInitiateDelete = () => {
		setShowConfirmation(true);
	};

	const handleCancel = () => {
		setShowConfirmation(false);
		form.reset();
	};

	return (
		<Card className="border-red-200 dark:border-red-800">
			<CardContent className="pt-6">
				<h3 className="text-lg font-semibold mb-2 text-red-600">
					Excluir Conta
				</h3>
				<p className="text-muted-foreground mb-4">
					Isso excluirá permanentemente sua Conta Pessoal. Por favor, note que
					esta ação é irreversível, então proceda com cautela.
				</p>
				<p className="text-red-600 text-sm mb-4 font-medium">
					Esta ação não pode ser desfeita!
				</p>

				{!showConfirmation ? (
					<Button variant="destructive" onClick={handleInitiateDelete}>
						Excluir conta
					</Button>
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="confirmation"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>
											Para confirmar, digite "DELETAR" no campo abaixo:
										</FormLabel>
										<FormControl>
											<Input
												placeholder="DELETAR"
												className="max-w-xs border-red-300 focus:border-red-500"
												{...field}
											/>
										</FormControl>
										<div className="min-h-[20px]">
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<div className="flex gap-2">
								<Button
									type="submit"
									variant="destructive"
									disabled={isPending}
								>
									{isPending ? "Excluindo..." : "Confirmar exclusão"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={handleCancel}
									disabled={isPending}
								>
									Cancelar
								</Button>
							</div>
						</form>
					</Form>
				)}
			</CardContent>
		</Card>
	);
}
