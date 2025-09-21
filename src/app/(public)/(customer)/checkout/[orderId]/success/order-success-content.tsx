"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getOrderByIdQueryOptions } from "@/http/orders/queries";
import { OrderDetails } from "./order-details";
import { OrderItems } from "./order-items";
import { OrderSummary } from "./order-summary";

interface OrderSuccessContentProps {
	orderId: string;
}

export function OrderSuccessContent({ orderId }: OrderSuccessContentProps) {
	const { data: order, error } = useSuspenseQuery(
		getOrderByIdQueryOptions(orderId),
	);

	if (error) {
		console.error(error);
		notFound();
	}

	return (
		<>
			<div className="flex flex-col">
				<h3 className="text-sm font-bold">Codigo de rastreio</h3>
				<span className="text-sm text-primary">
					{order.delivery?.id || "Não disponível"}
				</span>
			</div>

			<section className="grid grid-cols-1 gap-4">
				<OrderItems order={order} />
				<OrderDetails order={order} />
				<Separator className="my-6" />
				<OrderSummary order={order} />
			</section>
		</>
	);
}
