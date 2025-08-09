"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	coupon: z.object({
		code: z.string().min(1),
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

export function CheckoutCouponForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			coupon: {
				code: "",
			},
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Card className="space-y-8 bg-transparent border-none shadow-none">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="grid grid-cols-2 gap-4 items-start"
				>
					<FormField
						control={form.control}
						name="coupon.code"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cupom</FormLabel>
								<FormControl>
									<Input {...field} placeholder="ABC123" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormItem>
						<FormLabel className="invisible">Cupom</FormLabel>
						<FormControl>
							<Button type="submit">Aplicar Cupom</Button>
						</FormControl>
						<FormMessage className="invisible" />
					</FormItem>
				</form>
			</Form>

			<div className="flex items-center gap-2">
				<Check className="size-4 text-emerald-600" />
				<span className="text-sm text-muted-foreground">
					Cupom <strong className="text-foreground font-bold">123ABC</strong>{" "}
					aplicado
				</span>
			</div>
		</Card>
	);
}
