"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
	address: z.object({
		street: z.string().min(1),
		number: z.string().min(1),
		hasNoNumber: z.boolean().optional(),
		complement: z.string().optional(),
		hasNoComplement: z.boolean().optional(),
		neighborhood: z.string().min(1),
		city: z.string().min(1),
		state: z.string().min(1),
		postalCode: z.string().min(1),
		hasNoPostalCode: z.boolean().optional(),
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

export function CheckoutShippingAddressForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			address: {
				street: "",
				number: "",
				hasNoNumber: false,
				complement: "",
				hasNoComplement: false,
				neighborhood: "",
				city: "",
				state: "",
				postalCode: "",
			},
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Card className="p-8 space-y-8">
			<CardTitle className="flex items-center gap-2">
				Onde devemos entregar seu pedido?
			</CardTitle>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="address.street"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Rua</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Rua dos Bobos" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address.number"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Número</FormLabel>
								<FormControl>
									<Input {...field} placeholder="123" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address.hasNoNumber"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex items-start gap-3">
										<Checkbox
											id="hasNoNumber"
											checked={field.value ?? false}
											onCheckedChange={field.onChange}
										/>
										<div className="grid gap-2">
											<FormLabel htmlFor="hasNoNumber">Sem número?</FormLabel>
											<p className="text-muted-foreground text-sm">
												Caso seu endereço não tenha número, marque esta opção
											</p>
										</div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address.complement"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Complemento</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Apto 123" />
								</FormControl>
								<FormDescription>
									Digite o complemento da sua casa
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address.hasNoComplement"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex items-start gap-3">
										<Checkbox
											id="hasNoComplement"
											checked={field.value ?? false}
											onCheckedChange={field.onChange}
										/>
										<div className="grid gap-2">
											<FormLabel htmlFor="hasNoComplement">
												Sem complemento?
											</FormLabel>
											<p className="text-muted-foreground text-sm">
												Caso seu endereço não tenha complemento, marque esta
												opção
											</p>
										</div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address.neighborhood"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bairro</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Jardim das Flores" />
								</FormControl>
								<FormDescription>Digite o bairro da sua casa</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address.city"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cidade</FormLabel>
								<FormControl>
									<Input {...field} placeholder="São Paulo" />
								</FormControl>
								<FormDescription>Digite a cidade da sua casa</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address.state"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estado</FormLabel>
								<FormControl>
									<Input {...field} placeholder="SP" />
								</FormControl>
								<FormDescription>Digite o estado da sua casa</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address.postalCode"
						render={({ field }) => (
							<FormItem>
								<FormLabel>CEP</FormLabel>
								<FormControl>
									<Input {...field} placeholder="12345-678" />
								</FormControl>
								<FormDescription>Digite o CEP da sua casa</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address.hasNoPostalCode"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex items-start gap-3">
										<Checkbox
											id="hasNoPostalCode"
											checked={field.value ?? false}
											onCheckedChange={field.onChange}
										/>
										<div className="grid gap-2">
											<FormLabel htmlFor="hasNoPostalCode">Sem CEP?</FormLabel>
											<p className="text-muted-foreground text-sm">
												Caso seu endereço não tenha CEP, marque esta opção
											</p>
										</div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>

					<Button type="submit">Continuar</Button>
				</form>
			</Form>
		</Card>
	);
}
