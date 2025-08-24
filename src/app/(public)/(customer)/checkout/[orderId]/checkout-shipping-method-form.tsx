"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { ERROR_CODES, ERROR_MESSAGES } from "@/app/api/contants/error-codes";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	getOrderByIdQueryOptions,
	getOrderDeliveryMethodsQueryOptions,
	getOrderDeliveryQueryOptions,
	useUpdateOrderDeliveryMutation,
} from "@/http";
import { useCheckoutContext } from "./checkout-context";

const formSchema = z.object({
	shipping: z.object({
		orderDeliveryMethodId: z.string(),
	}),
});

type ShippingFormValues = z.infer<typeof formSchema>;
interface CheckoutShippingMethodFormProps {
	orderId: string;
}

export function CheckoutShippingMethodForm({
	orderId,
}: CheckoutShippingMethodFormProps) {
	const queryClient = useQueryClient();
	const { goToNextStep } = useCheckoutContext();

	const form = useForm<ShippingFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			shipping: {
				orderDeliveryMethodId: "",
			},
		},
	});

	const { data: orderDelivery } = useQuery(
		getOrderDeliveryQueryOptions(orderId),
	);

	const { data: orderDeliveryMethods = [] } = useQuery(
		getOrderDeliveryMethodsQueryOptions(),
	);

	const { mutate: updateOrderDeliveryMethod, isPending } =
		useUpdateOrderDeliveryMutation({
			onSuccess: (data) => {
				console.log(data);
				// Invalidate both order and order delivery queries to refresh data
				queryClient.invalidateQueries(getOrderByIdQueryOptions(orderId));
				queryClient.invalidateQueries(getOrderDeliveryQueryOptions(orderId));
				// Move to next step after successful submission
				goToNextStep("shipping-method");
			},
			onError: (error) => {
				console.error(error);
				switch (error.message) {
					case ERROR_CODES.FAILED_TO_CREATE_ORDER_DELIVERY:
						toast.error(
							ERROR_MESSAGES[ERROR_CODES.FAILED_TO_CREATE_ORDER_DELIVERY],
						);
						break;
					default:
						toast.error(ERROR_MESSAGES[ERROR_CODES.UNEXPECTED_ERROR]);
				}
			},
		});

	useEffect(() => {
		if (orderDelivery?.orderDeliveryMethodId) {
			// If order already has a delivery method selected, use it
			form.reset({
				shipping: {
					orderDeliveryMethodId: orderDelivery.orderDeliveryMethodId,
				},
			});
		} else if (
			orderDeliveryMethods.length > 0 &&
			!form.getValues("shipping.orderDeliveryMethodId")
		) {
			// If no delivery method is selected and methods are available, select the first one
			const firstMethodId = orderDeliveryMethods[0].id;
			form.reset({
				shipping: {
					orderDeliveryMethodId: firstMethodId,
				},
			});

			// Note: We don't auto-submit here to avoid errors on page load
			// User can submit manually if they want to save the selection
		}
	}, [orderDelivery, orderDeliveryMethods, form]);

	function onSubmit(values: ShippingFormValues) {
		updateOrderDeliveryMethod({
			orderId,
			orderDeliveryMethodId: values.shipping.orderDeliveryMethodId,
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="shipping.orderDeliveryMethodId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Método de envio</FormLabel>
							<FormControl>
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger>
										<SelectValue placeholder="Selecione..." />
									</SelectTrigger>
									<SelectContent>
										<Suspense
											fallback={
												<SelectItem value="loading">
													<Skeleton className="h-10 w-full" />
												</SelectItem>
											}
										>
											{orderDeliveryMethods.length === 0 && (
												<SelectItem value="no-delivery-methods">
													Nenhum método de envio disponível
												</SelectItem>
											)}
											{orderDeliveryMethods?.map((orderDeliveryMethod) => (
												<SelectItem
													key={orderDeliveryMethod.id}
													value={orderDeliveryMethod.id}
												>
													{orderDeliveryMethod.method}
												</SelectItem>
											))}
										</Suspense>
									</SelectContent>
								</Select>
							</FormControl>
							<FormDescription>
								Diferentes métodos de envio podem ter custos diferentes
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isPending} className="w-full">
					{isPending ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						"Continuar"
					)}
				</Button>
			</form>
		</Form>
	);
}
