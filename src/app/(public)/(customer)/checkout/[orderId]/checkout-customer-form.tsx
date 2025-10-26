"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
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
import { InputMask } from "@/components/ui/input-mask";
import {
	getOrderByIdQueryOptions,
	useCreateCustomerMutation,
	useUpdateOrderCustomerIdMutation,
} from "@/http";
import { useCheckoutContext } from "./checkout-context";

const formSchema = z.object({
	customer: z.object({
		fullName: z
			.string()
			.min(2, "Nome é obrigatório")
			.refine(
				(value) => {
					const words = value.trim().split(/\s+/);
					return words.length >= 2;
				},
				{
					message: "Informe seu nome e sobrenome",
				},
			),
		email: z.email(),
		phone: z.string().min(1),
	}),
});

type CustomerFormValues = z.infer<typeof formSchema>;

interface CheckoutCustomerFormProps {
	orderId: string;
}

export function CheckoutCustomerForm({ orderId }: CheckoutCustomerFormProps) {
	const queryClient = useQueryClient();
	const { goToNextStep } = useCheckoutContext();

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
			// Show the actual error message from the backend
			toast.error(error.message);
		},
	});

	const updateOrderCustomerIdMutation = useUpdateOrderCustomerIdMutation({
		onSuccess: (data) => {
			console.log(data);
			// Invalidate order query to refresh checkout button state
			queryClient.invalidateQueries(getOrderByIdQueryOptions(orderId));
			// Move to next step after successful submission
			goToNextStep("customer");
		},
		onError: (error) => {
			console.error(error);
			// Show the actual error message from the backend
			toast.error(error.message);
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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="customer.fullName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Seu nome completo</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Victor Nogueira" />
							</FormControl>
							<FormDescription>Como devemos te chamar?</FormDescription>
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
								<InputMask
									{...field}
									mask="(99) 99999-9999"
									maskOptions={{
										placeholder: "",
										showMaskOnHover: false,
									}}
									placeholder="(11) 99999-9999"
								/>
							</FormControl>
							<FormDescription>
								Caso algum problema ocorra, entraremos em contato por aqui
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isPending} className="w-full">
					{isPending ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						"Continuar"
					)}
				</Button>
			</form>
		</Form>
	);
}
