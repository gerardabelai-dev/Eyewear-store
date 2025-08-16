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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Customer } from "@/lib/db/schema";

const customerFormSchema = z.object({
	firstName: z.string().min(1, "Nome é obrigatório"),
	lastName: z.string().min(1, "Sobrenome é obrigatório"),
});
type CustomerFormValues = z.infer<typeof customerFormSchema>;

const customerAddressFormSchema = z.object({
	street: z.string().min(1, "Rua é obrigatória"),
	number: z.string().optional(),
	complement: z.string().optional(),
	neighborhood: z.string().min(1, "Bairro é obrigatório"),
	city: z.string().min(1, "Cidade é obrigatória"),
	state: z.string().min(1, "Estado é obrigatório"),
	zipCode: z.string().optional(),
	country: z.string().min(1, "País é obrigatório"),
	isDefault: z.boolean().optional(),
});
type CustomerAddressFormValues = z.infer<typeof customerAddressFormSchema>;

interface CustomerFormProps {
	customer?: Customer;
	onSuccess?: () => void;
}

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
	const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
	const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const customerDetailsForm = useForm<CustomerFormValues>({
		resolver: zodResolver(customerFormSchema),
		defaultValues: {
			firstName: customer?.firstName || "",
			lastName: customer?.lastName || "",
		},
	});
	const customerAddressForm = useForm<CustomerAddressFormValues>({
		resolver: zodResolver(customerAddressFormSchema),
		defaultValues: {
			isDefault: false,
		},
	});

	const onSubmitCustomerDetails = async (_values: CustomerFormValues) => {
		setIsSubmittingDetails(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 3000));

		toast.success(
			customer
				? "Cliente atualizado com sucesso!"
				: "Cliente criado com sucesso!",
		);
		setIsSubmittingDetails(false);
		customerDetailsForm.reset();
		onSuccess?.();
	};

	const onSubmitCustomerAddress = async (
		_values: CustomerAddressFormValues,
	) => {
		setIsSubmittingAddress(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 3000));

		toast.success(
			customer
				? "Endereço atualizado com sucesso!"
				: "Endereço criado com sucesso!",
		);
		setIsSubmittingAddress(false);
		customerAddressForm.reset();
		onSuccess?.();
	};

	const handleDelete = async () => {
		if (!customer) return;
		setIsDeleting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 3000));
		toast.success("Cliente excluído com sucesso!");
		setIsDeleting(false);
		onSuccess?.();
	};

	// Check if any operation is in progress
	const isAnyOperationInProgress =
		isSubmittingDetails || isSubmittingAddress || isDeleting;

	return (
		<section className="flex flex-col gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Informações do Cliente</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...customerDetailsForm}>
						<form
							onSubmit={customerDetailsForm.handleSubmit(
								onSubmitCustomerDetails,
							)}
							className="space-y-4"
						>
							<FormField
								control={customerDetailsForm.control}
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
								control={customerDetailsForm.control}
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
								<Button
									type="submit"
									disabled={isAnyOperationInProgress}
									className="w-full"
								>
									{isSubmittingDetails
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
										disabled={isAnyOperationInProgress}
										className="w-full"
									>
										{isDeleting ? "Excluindo..." : "Excluir"}
									</Button>
								)}
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Endereços</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...customerAddressForm}>
						<form
							onSubmit={customerAddressForm.handleSubmit(
								onSubmitCustomerAddress,
							)}
							className="space-y-4"
						>
							<FormField
								control={customerAddressForm.control}
								name="street"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Rua</FormLabel>
										<FormControl>
											<Input placeholder="Rua" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={customerAddressForm.control}
								name="number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Número</FormLabel>
										<FormControl>
											<Input placeholder="Número" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={customerAddressForm.control}
								name="complement"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Complemento</FormLabel>
										<FormControl>
											<Input placeholder="Complemento" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={customerAddressForm.control}
								name="neighborhood"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bairro</FormLabel>
										<FormControl>
											<Input placeholder="Bairro" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={customerAddressForm.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cidade</FormLabel>
										<FormControl>
											<Input placeholder="Cidade" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={customerAddressForm.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Estado</FormLabel>
										<FormControl>
											<Input placeholder="Estado" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={customerAddressForm.control}
								name="zipCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>CEP</FormLabel>
										<FormControl>
											<Input placeholder="CEP" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={customerAddressForm.control}
								name="country"
								render={({ field }) => (
									<FormItem>
										<FormLabel>País</FormLabel>
										<FormControl>
											<Input placeholder="País" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={customerAddressForm.control}
								name="isDefault"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
										<div className="space-y-0.5">
											<FormLabel>Endereço padrão</FormLabel>
											<FormDescription>
												Endereço padrão para o cliente.
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={Boolean(field.value)}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<div className="flex flex-col gap-3">
								<Button
									type="submit"
									disabled={isAnyOperationInProgress}
									className="w-full"
								>
									{isSubmittingAddress
										? "Salvando..."
										: customer
											? "Atualizar Endereço"
											: "Criar Endereço"}
								</Button>

								{customer && (
									<Button
										type="button"
										variant="destructive"
										onClick={handleDelete}
										disabled={isAnyOperationInProgress}
										className="w-full"
									>
										{isDeleting ? "Excluindo..." : "Excluir"}
									</Button>
								)}
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</section>
	);
}
