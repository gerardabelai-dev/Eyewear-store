"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
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
import { useCheckoutContext } from "./checkout-context";

const formSchema = z
	.object({
		address: z.object({
			street: z.string().min(1),
			number: z.string().optional(),
			hasNoNumber: z.boolean().optional(),
			complement: z.string().optional(),
			hasNoComplement: z.boolean().optional(),
			neighborhood: z.string().min(1),
			city: z.string().min(1),
			state: z.string().min(1),
			zipCode: z.string().optional(),
			hasNozipCode: z.boolean().optional(),
		}),
	})
	.superRefine((data, ctx) => {
		// If "hasNoNumber" is not checked, number is required
		if (
			!data.address.hasNoNumber &&
			(!data.address.number || data.address.number.trim() === "")
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Número é obrigatório",
				path: ["address", "number"],
			});
		}

		// If "hasNozipCode" is not checked, zipCode is required
		if (
			!data.address.hasNozipCode &&
			(!data.address.zipCode || data.address.zipCode.trim() === "")
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "CEP é obrigatório",
				path: ["address", "zipCode"],
			});
		}

		// Complement is always optional, no validation needed for hasNoComplement
	});

type CustomerAddressFormValues = z.infer<typeof formSchema>;

interface CheckoutShippingAddressFormProps {
	orderId: string;
}

export function CheckoutShippingAddressForm({
	orderId,
}: CheckoutShippingAddressFormProps) {
	const queryClient = useQueryClient();
	const { goToNextStep } = useCheckoutContext();

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
				hasNozipCode: false,
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
			// Show the actual error message from the backend
			toast.error(error.message);
		},
	});

	const updateOrderCustomerAddressIdMutation =
		useUpdateOrderCustomerAddressIdMutation({
			onSuccess: (data) => {
				console.log(data);
				// Invalidate order query to refresh checkout button state
				queryClient.invalidateQueries(getOrderByIdQueryOptions(orderId));
				// Move to next step after successful submission
				goToNextStep("shipping-address");
			},
			onError: (error) => {
				console.error(error);
				// Show the actual error message from the backend
				toast.error(error.message);
			},
		});

	const isPending =
		createCustomerAddressMutation.isPending ||
		updateOrderCustomerAddressIdMutation.isPending;

	// Watch checkbox values to handle field disabling
	const hasNoNumber = form.watch("address.hasNoNumber");
	const hasNoComplement = form.watch("address.hasNoComplement");
	const hasNozipCode = form.watch("address.hasNozipCode");

	// Clear fields when checkboxes are checked
	useEffect(() => {
		if (hasNoNumber) {
			form.setValue("address.number", "");
		}
	}, [hasNoNumber, form]);

	useEffect(() => {
		if (hasNoComplement) {
			form.setValue("address.complement", "");
		}
	}, [hasNoComplement, form]);

	useEffect(() => {
		if (hasNozipCode) {
			form.setValue("address.zipCode", "");
		}
	}, [hasNozipCode, form]);

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

			// Use stored checkbox states from database
			form.setValue(
				"address.hasNoNumber",
				order.customerAddress.hasNoNumber || false,
			);
			form.setValue(
				"address.hasNoComplement",
				order.customerAddress.hasNoComplement || false,
			);
			form.setValue(
				"address.hasNozipCode",
				order.customerAddress.hasNozipCode || false,
			);
		}
	}, [order, form]);

	function onSubmit(values: CustomerAddressFormValues) {
		createCustomerAddressMutation.mutate({
			orderId,
			street: values.address.street,
			number: values.address.hasNoNumber ? "" : values.address.number || "",
			hasNoNumber: values.address.hasNoNumber || false,
			complement: values.address.hasNoComplement
				? ""
				: values.address.complement || "",
			hasNoComplement: values.address.hasNoComplement || false,
			neighborhood: values.address.neighborhood,
			city: values.address.city,
			state: values.address.state,
			zipCode: values.address.hasNozipCode ? "" : values.address.zipCode || "",
			hasNozipCode: values.address.hasNozipCode || false,
			country: "BR",
			isDefault: true,
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
								<Input {...field} placeholder="123" disabled={hasNoNumber} />
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
								<Input
									{...field}
									placeholder="Apto 123"
									disabled={hasNoComplement}
								/>
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
											Caso seu endereço não tenha complemento, marque esta opção
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
								<Input
									{...field}
									placeholder="12345-678"
									disabled={hasNozipCode}
								/>
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
