"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { OrderForm } from "@/components/forms/order-form";
import { OrdersAdvancedTable } from "@/components/orders-advanced-table";
import { Drawer } from "@/components/ui/drawer";
import { useAuth } from "@/lib/hooks/use-auth";
import type { Order, OrderStatus } from "@/lib/types";
import { ordersKey } from "@/lib/utils/query-keys";

interface OrdersTableWrapperProps {
	orders: Order[];
	orderStatuses: OrderStatus[];
}

export function OrdersTableWrapper({
	orders,
	orderStatuses,
}: OrdersTableWrapperProps) {
	const { data: user } = useAuth();
	const queryClient = useQueryClient();
	const { ref, inView } = useInView();
	const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
		Order[],
		Error,
		InfiniteData<Order[]>,
		typeof ordersKey,
		number
	>({
		queryKey: ordersKey(user?.id || ""),
		queryFn: async ({ pageParam = 1 }) => {
			const res = await fetch(`/api/orders?page=${pageParam}`);
			return res.json();
		},
		getNextPageParam: (lastPage) =>
			lastPage.length === 10 ? (data?.pages.length ?? 0) + 1 : undefined,
		initialPageParam: 1,
		enabled: !!user?.id,
	});
	const allOrders = data?.pages.flat() ?? [];
	useEffect(() => {
		if (inView && hasNextPage) fetchNextPage();
	}, [inView, hasNextPage]);
	// Render table with orders, add ref to last row for infinite scroll
	// Handle editing with getOrderByIdQuery if needed
}
