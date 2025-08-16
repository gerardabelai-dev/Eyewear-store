"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getOrderByIdQueryOptions } from "@/http/orders/queries";
import { OrderDetails } from "../../checkout/[orderId]/success/order-details";
import { OrderItems } from "../../checkout/[orderId]/success/order-items";
import { OrderSummary } from "../../checkout/[orderId]/success/order-summary";
import { OrderTimeline } from "./order-timeline";

interface OrdersPageContentProps {
	orderId: string;
}

export function OrdersPageContent({ orderId }: OrdersPageContentProps) {
	const { data: order, error } = useSuspenseQuery(
		getOrderByIdQueryOptions(orderId),
	);

	if (error) {
		console.error(error);
		notFound();
	}

	return (
		<>
			{/* Tracking code */}
			<div className="flex flex-col">
				<h3 className="text-sm font-bold">Codigo de rastreio</h3>
				<span className="text-sm text-vibrant">
					{order.delivery?.id || "Não disponível"}
				</span>
			</div>

			<section className="grid grid-cols-1 gap-4">
				{/* Order items */}
				<OrderItems order={order} />

				<Separator className="my-6" />

				{/* Order timeline */}
				<OrderTimeline order={order} />

				{/* Order details (addresses, payment, shipping) */}
				<OrderDetails order={order} />

				<Separator className="my-6" />

				{/* Order summary */}
				<OrderSummary order={order} />
			</section>
		</>
	);
}
