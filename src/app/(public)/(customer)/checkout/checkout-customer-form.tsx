"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
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
	// address: z.object({
	// 	street: z.string().min(1),
	// 	number: z.string().min(1),
	// 	complement: z.string().optional(),
	// 	neighborhood: z.string().min(1),
	// 	city: z.string().min(1),
	// 	state: z.string().min(1),
	// 	zip: z.string().min(1),
	// }),
	// shipping: z.object({
	// 	method: z.enum(["standard", "express"]),
	// 	cost: z.number().positive(),
	// }),
	// payment: z.object({
	// 	method: z.enum(["credit_card", "debit_card", "pix", "boleto"]),
	// }),
	// promoCode: z.string().optional(),
});

/*
 Checkout form 
 - Customer information
 - Shipping address
 - Shipping method
 - Payment method
 - Subtotal + Total
 - Promo Code
 - Checkout button
*/

export function CheckoutCustomerForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			customer: {
				fullName: "",
			},
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
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

					<Button type="submit">Continuar</Button>
				</form>
			</Form>
		</Card>
	);
}
