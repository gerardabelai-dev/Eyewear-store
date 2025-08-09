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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
	payment: z.object({
		method: z.enum(["credit_card", "debit_card", "pix", "boleto"]),
	}),
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

export function CheckoutPaymentMethodForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			payment: {
				method: "credit_card",
			},
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Card className="p-8 space-y-8">
			<CardTitle className="flex items-center gap-2">
				Seu método de pagamento
			</CardTitle>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="payment.method"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Método de pagamento</FormLabel>
								<FormControl>
									<Select {...field}>
										<SelectTrigger>
											<SelectValue placeholder="Selecione o método de pagamento" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="credit_card">
												Cartão de crédito
											</SelectItem>
											<SelectItem value="debit_card">
												Cartão de débito
											</SelectItem>
											<SelectItem value="pix">Pix</SelectItem>
											<SelectItem value="boleto">Boleto</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>
									Selecione o método de pagamento
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
