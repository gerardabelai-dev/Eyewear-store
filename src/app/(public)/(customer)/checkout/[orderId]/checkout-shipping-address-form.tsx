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
import {
	getOrderByIdQueryOptions,
	useCreateCustomerAddressMutation,
	useUpdateOrderCustomerAddressIdMutation,
} from "@/http";

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
		zipCode: z.string().min(1),
		hasNozipCode: z.boolean().optional(),
	}),
});

type CustomerAddressFormValues = z.infer<typeof formSchema>;

interface CheckoutShippingAddressFormProps {
	orderId: string;
}

export function CheckoutShippingAddressForm({
	orderId,
}: CheckoutShippingAddressFormProps) {
	const form = useForm<CustomerAddressFormValues>({
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
				zipCode: "",
			},
		},
	});

	const { data: order } = useQuery(getOrderByIdQueryOptions(orderId));

	const createCustomerAddressMutation = useCreateCustomerAddressMutation({
		onSuccess: (data) => {
			// Update order with customer address id
			updateOrderCustomerAddressIdMutation.mutate({
				orderId,
				customerAddressId: data.customerAddress.id,
			});
		},
		onError: (error) => {
			console.error(error);
			switch (error.message) {
				case ERROR_CODES.FAILED_TO_CREATE_CUSTOMER_ADDRESS:
					toast.error(
						ERROR_MESSAGES[ERROR_CODES.FAILED_TO_CREATE_CUSTOMER_ADDRESS],
					);
					break;
				default:
					toast.error(ERROR_MESSAGES[ERROR_CODES.UNEXPECTED_ERROR]);
			}
		},
	});

	const updateOrderCustomerAddressIdMutation =
		useUpdateOrderCustomerAddressIdMutation({
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
		createCustomerAddressMutation.isPending ||
		updateOrderCustomerAddressIdMutation.isPending;

	// Update form when order data is available
	useEffect(() => {
		if (order?.customerAddress) {
			form.setValue("address.street", order.customerAddress.street || "");
			form.setValue("address.number", order.customerAddress.number || "");
			form.setValue(
				"address.complement",
				order.customerAddress.complement || "",
			);
			form.setValue(
				"address.neighborhood",
				order.customerAddress.neighborhood || "",
			);
			form.setValue("address.city", order.customerAddress.city || "");
			form.setValue("address.state", order.customerAddress.state || "");
			form.setValue("address.zipCode", order.customerAddress.zipCode || "");
		}
	}, [order, form]);

	function onSubmit(values: CustomerAddressFormValues) {
		createCustomerAddressMutation.mutate({
			orderId,
			street: values.address.street,
			number: values.address.number,
			complement: values.address.complement || "",
			neighborhood: values.address.neighborhood,
			city: values.address.city,
			state: values.address.state,
			zipCode: values.address.zipCode,
			country: "BR",
			isDefault: true,
		});
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
						name="address.zipCode"
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
						name="address.hasNozipCode"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex items-start gap-3">
										<Checkbox
											id="hasNozipCode"
											checked={field.value ?? false}
											onCheckedChange={field.onChange}
										/>
										<div className="grid gap-2">
											<FormLabel htmlFor="hasNozipCode">Sem CEP?</FormLabel>
											<p className="text-muted-foreground text-sm">
												Caso seu endereço não tenha CEP, marque esta opção
											</p>
										</div>
									</div>
								</FormControl>
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
