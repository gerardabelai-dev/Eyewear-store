"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
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
import type { OrderDeliveryMethod } from "@/lib/db/schema";

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
	const { data: orderDeliveryMethods } = useSuspenseQuery({
		queryKey: ["orderDeliveryMethods"],
		queryFn: async () => {
			const response = await fetch("/api/order-delivery-methods/list-all");
			const { orderDeliveryMethods } = await response.json();
			console.log(orderDeliveryMethods);
			return orderDeliveryMethods as OrderDeliveryMethod[];
		},
	});

	const { mutate: updateOrderDeliveryMethod, isPending } = useMutation({
		mutationFn: async (values: ShippingFormValues) => {
			const response = await fetch(
				`/api/order-deliveries/create-order-delivery`,
				{
					method: "POST",
					body: JSON.stringify({
						orderId,
						orderDeliveryMethodId: values.shipping.orderDeliveryMethodId,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(ERROR_CODES.FAILED_TO_UPDATE_ORDER_DELIVERY_METHOD);
			}

			return response.json();
		},
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (error) => {
			console.error(error);
			switch (error.message) {
				case ERROR_CODES.FAILED_TO_UPDATE_ORDER_DELIVERY_METHOD:
					toast.error(
						ERROR_MESSAGES[ERROR_CODES.FAILED_TO_UPDATE_ORDER_DELIVERY_METHOD],
					);
					break;
				default:
					toast.error(ERROR_MESSAGES[ERROR_CODES.UNEXPECTED_ERROR]);
			}
		},
	});

	const form = useForm<ShippingFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			shipping: {
				orderDeliveryMethodId: orderDeliveryMethods[0].id,
			},
		},
	});

	function onSubmit(values: ShippingFormValues) {
		updateOrderDeliveryMethod(values);
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
