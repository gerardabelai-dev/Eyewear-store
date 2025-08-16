"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrderPaymentMethod } from "@/lib/db/schema";

const formSchema = z.object({
	payment: z.object({
		orderPaymentMethodId: z.string(),
	}),
});

interface CheckoutPaymentMethodFormProps {
	orderId: string;
}

export function CheckoutPaymentMethodForm({
	orderId,
}: CheckoutPaymentMethodFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			payment: {
				orderPaymentMethodId: "",
			},
		},
	});

	const { data: order } = useQuery({
		queryKey: ["order", { id: orderId }],
		queryFn: async () => {
			const response = await fetch(`/api/orders/${orderId}/get-order-by-id`);

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.FAILED_TO_GET_ORDER_DETAILS);
			}

			const { order } = await response.json();

			return order;
		},
	});

	const { data: orderPaymentMethods = [] } = useQuery({
		queryKey: ["orderPaymentMethods"],
		queryFn: async () => {
			const response = await fetch("/api/order-payment-methods/list-all");
			const { orderPaymentMethods } = await response.json();
			return orderPaymentMethods as OrderPaymentMethod[];
		},
	});

	const { mutate: updateOrderPaymentMethod, isPending } = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			const response = await fetch("/api/order-payments/create-order-payment", {
				method: "POST",
				body: JSON.stringify({
					orderId,
					orderPaymentMethodId: values.payment.orderPaymentMethodId,
				}),
			});

			if (!response.ok) {
				throw new Error(ERROR_CODES.FAILED_TO_CREATE_ORDER_PAYMENT);
			}

			return response.json();
		},
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (error) => {
			console.error(error);
			switch (error.message) {
				case ERROR_CODES.FAILED_TO_CREATE_ORDER_PAYMENT:
					toast.error(
						ERROR_MESSAGES[ERROR_CODES.FAILED_TO_CREATE_ORDER_PAYMENT],
					);
					break;
				default:
					toast.error(ERROR_MESSAGES[ERROR_CODES.UNEXPECTED_ERROR]);
			}
		},
	});

	useEffect(() => {
		if (order?.payment?.orderPaymentMethodId) {
			// If order already has a payment method, use it
			form.setValue(
				"payment.orderPaymentMethodId",
				order.payment.orderPaymentMethodId,
				{ shouldValidate: true, shouldDirty: true, shouldTouch: true },
			);
		} else if (
			orderPaymentMethods.length > 0 &&
			!form.getValues("payment.orderPaymentMethodId")
		) {
			// If no existing payment method but we have options, set the first one
			form.setValue("payment.orderPaymentMethodId", orderPaymentMethods[0].id, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
		}
	}, [order, orderPaymentMethods, form]);

	function onSubmit(values: z.infer<typeof formSchema>) {
		updateOrderPaymentMethod(values);
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
						name="payment.orderPaymentMethodId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Método de pagamento</FormLabel>
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
												{orderPaymentMethods.length === 0 && (
													<SelectItem value="no-payment-methods">
														Nenhum método de pagamento disponível
													</SelectItem>
												)}
												{orderPaymentMethods?.map((orderPaymentMethod) => (
													<SelectItem
														key={orderPaymentMethod.id}
														value={orderPaymentMethod.id}
													>
														{orderPaymentMethod.method}
													</SelectItem>
												))}
											</Suspense>
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

					<Button type="submit" disabled={isPending}>
						{isPending ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							"Continuar"
						)}
					</Button>
				</form>
			</Form>
		</Card>
	);
}
