"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { ERROR_CODES, ERROR_MESSAGES } from "@/app/api/contants/error-codes";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
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

const formSchema = z.object({
	customer: z.object({
		fullName: z.string().min(2),
		email: z.email(),
		phone: z.string().min(1),
	}),
});

type CustomerFormValues = z.infer<typeof formSchema>;

interface CheckoutCustomerFormProps {
	orderId: string;
}

export function CheckoutCustomerForm({ orderId }: CheckoutCustomerFormProps) {
	const { mutate: createCustomer, isPending } = useMutation({
		mutationFn: async (values: CustomerFormValues) => {
			// Create user and customer
			const [firstName, lastName] = values.customer.fullName.split(" ");
			const createCustomerResponse = await fetch(
				"/api/customers/create-customer",
				{
					method: "POST",
					body: JSON.stringify({
						firstName,
						lastName,
						email: values.customer.email,
						phoneNumber: values.customer.phone,
					}),
				},
			);

			if (!createCustomerResponse.ok) {
				console.error(createCustomerResponse);
				throw new Error(ERROR_CODES.FAILED_TO_CREATE_CUSTOMER);
			}

			const { customer } = await createCustomerResponse.json();

			// Update order with customer id
			const updateOrderResponse = await fetch(
				`/api/orders/${orderId}/update-order-customer-id`,
				{
					method: "POST",
					body: JSON.stringify({
						orderId,
						customerId: customer.id,
					}),
				},
			);

			if (!updateOrderResponse.ok) {
				console.error(updateOrderResponse);
				throw new Error(ERROR_CODES.FAILED_TO_UPDATE_ORDER);
			}

			const { order } = await updateOrderResponse.json();

			console.log(order);

			return customer;
		},
		onSuccess: (data: { customer: { id: string } }) => {
			console.log(data);
		},
		onError: (error) => {
			console.error(error);
			switch (error.message) {
				case ERROR_CODES.FAILED_TO_CREATE_CUSTOMER:
					toast.error(ERROR_MESSAGES[ERROR_CODES.FAILED_TO_CREATE_CUSTOMER]);
					break;
				case ERROR_CODES.FAILED_TO_UPDATE_ORDER:
					toast.error(ERROR_MESSAGES[ERROR_CODES.FAILED_TO_UPDATE_ORDER]);
					break;
				default:
					toast.error(ERROR_MESSAGES[ERROR_CODES.UNEXPECTED_ERROR]);
			}
		},
	});

	const form = useForm<CustomerFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			customer: {
				fullName: "",
				email: "",
				phone: "",
			},
		},
	});

	function onSubmit(values: CustomerFormValues) {
		createCustomer(values);
	}

	return (
		<Card className="p-8 space-y-8">
			<CardTitle className="flex items-center gap-2">
				Suas informações
			</CardTitle>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="customer.fullName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Seu nome</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Victor Nogueira" />
								</FormControl>
								<FormDescription>Informe seu nome completo</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="customer.email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Seu melhor e-mail</FormLabel>
								<FormControl>
									<Input {...field} placeholder="victor@email.com" />
								</FormControl>
								<FormDescription>
									Enviaremos e-mails com atualizações do seu pedido
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="customer.phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>WhatsApp</FormLabel>
								<FormControl>
									<Input {...field} placeholder="(11) 99999-9999" />
								</FormControl>
								<FormDescription>
									Caso algum problema ocorra, entraremos em contato por aqui
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isPending}>
						{isPending ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							"Continuar"
						)}
					</Button>
				</form>
			</Form>
		</Card>
	);
}
