"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Customer } from "@/lib/db/schema";

const customerFormSchema = z.object({
	firstName: z.string().min(1, "Nome é obrigatório"),
	lastName: z.string().min(1, "Sobrenome é obrigatório"),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface CustomerFormProps {
	customer?: Customer;
	onSuccess?: () => void;
}

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CustomerFormValues>({
		resolver: zodResolver(customerFormSchema),
		defaultValues: {
			firstName: customer?.firstName || "",
			lastName: customer?.lastName || "",
		},
	});

	const onSubmit = async (_values: CustomerFormValues) => {
		setIsSubmitting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 3000));

		toast.success(
			customer
				? "Cliente atualizado com sucesso!"
				: "Cliente criado com sucesso!",
		);
		setIsSubmitting(false);
		form.reset();
		onSuccess?.();
	};

	const handleDelete = async () => {
		if (!customer) return;
		setIsSubmitting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 3000));
		toast.success("Cliente excluído com sucesso!");
		setIsSubmitting(false);
		onSuccess?.();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{customer ? "Editar Cliente" : "Criar Cliente"}</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input placeholder="Nome do cliente" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sobrenome</FormLabel>
									<FormControl>
										<Input placeholder="Sobrenome do cliente" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex flex-col gap-3">
							<Button type="submit" disabled={isSubmitting} className="w-full">
								{isSubmitting
									? "Salvando..."
									: customer
										? "Atualizar Cliente"
										: "Criar Cliente"}
							</Button>

							{customer && (
								<Button
									type="button"
									variant="destructive"
									onClick={handleDelete}
									disabled={isSubmitting}
									className="w-full"
								>
									{isSubmitting ? "Excluindo..." : "Excluir"}
								</Button>
							)}
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
