"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
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
import {
	getOrderByIdQueryOptions,
	useCreateCustomerMutation,
	useUpdateOrderCustomerIdMutation,
} from "@/http";

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

	const { data: order } = useQuery(getOrderByIdQueryOptions(orderId));

	const createCustomerMutation = useCreateCustomerMutation({
		onSuccess: (data) => {
			// Update order with customer id
			updateOrderCustomerIdMutation.mutate({
				orderId,
				customerId: data.customer.id,
			});
		},
		onError: (error) => {
			console.error(error);
			switch (error.message) {
				case ERROR_CODES.FAILED_TO_CREATE_CUSTOMER:
					toast.error(ERROR_MESSAGES[ERROR_CODES.FAILED_TO_CREATE_CUSTOMER]);
					break;
				default:
					toast.error(ERROR_MESSAGES[ERROR_CODES.UNEXPECTED_ERROR]);
			}
		},
	});

	const updateOrderCustomerIdMutation = useUpdateOrderCustomerIdMutation({
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (error) => {
			console.error(error);
			switch (error.message) {
				case ERROR_CODES.FAILED_TO_UPDATE_ORDER:
					toast.error(ERROR_MESSAGES[ERROR_CODES.FAILED_TO_UPDATE_ORDER]);
					break;
				default:
					toast.error(ERROR_MESSAGES[ERROR_CODES.UNEXPECTED_ERROR]);
			}
		},
	});

	const isPending =
		createCustomerMutation.isPending || updateOrderCustomerIdMutation.isPending;

	useEffect(() => {
		if (order?.customer && order.customer.user) {
			form.setValue(
				"customer.fullName",
				`${order.customer.firstName} ${order.customer.lastName}`,
			);
			form.setValue("customer.email", order.customer.user.email);
			form.setValue("customer.phone", order.customer.phoneNumber || "");
		}
	}, [order, form]);

	function onSubmit(values: CustomerFormValues) {
		// Create user and customer
		const [firstName, lastName] = values.customer.fullName.split(" ");
		createCustomerMutation.mutate({
			firstName,
			lastName,
			email: values.customer.email,
			phoneNumber: values.customer.phone,
		});
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
						{isPending ? <Loader2 className="size-4 animate-spin" /> : "Salvar"}
					</Button>
				</form>
			</Form>
		</Card>
	);
}
