"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { OrdersTableWrapper } from "@/components/orders-table-wrapper";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Order } from "@/types/order";

export function OrdersTableClient() {
	const { data } = useInfiniteQuery<Order[], Error>({
		queryKey: ["orders"],
		queryFn: () => fetch("/api/orders").then((res) => res.json()),
		initialPageParam: 1,
	});
	const orders = data?.pages.flat() ?? [];
	const { data: orderStatuses } = useQuery({
		queryKey: ["orderStatuses"],
		queryFn: () => fetch("/api/order-status").then((res) => res.json()),
	});
	return (
		<OrdersTableWrapper orders={orders} orderStatuses={orderStatuses || []} />
	);
}
