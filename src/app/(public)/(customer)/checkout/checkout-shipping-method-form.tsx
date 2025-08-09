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
	shipping: z.object({
		method: z.enum(["standard", "express"]),
		cost: z.number().positive(),
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

export function CheckoutShippingMethodForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			shipping: {
				method: "standard",
				cost: 0,
			},
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Card className="p-8 space-y-8">
			<CardTitle className="flex items-center gap-2">
				Seu método de envio
			</CardTitle>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="shipping.method"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Método de envio</FormLabel>
								<FormControl>
									<Select {...field}>
										<SelectTrigger>
											<SelectValue placeholder="Selecione o método de envio" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="standard">
												Standard - R$ 10,00
											</SelectItem>
											<SelectItem value="express">
												Express - R$ 20,00
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>Selecione o método de envio</FormDescription>
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
