"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
	getOrderByIdQueryOptions,
	useUpdateOrderCustomerIdMutation,
} from "@/http";
import { useCheckoutContext } from "./checkout-context";

interface CheckoutAutoLinkProps {
	orderId: string;
}

export function CheckoutAutoLink({ orderId }: CheckoutAutoLinkProps) {
	const queryClient = useQueryClient();
	const { authenticatedCustomer } = useCheckoutContext();

	const updateOrderCustomerIdMutation = useUpdateOrderCustomerIdMutation({
		onSuccess: () => {
			// Invalidate order query to refresh the checkout state
			queryClient.invalidateQueries(getOrderByIdQueryOptions(orderId));
		},
		onError: (error) => {
			console.error("Error linking order to customer:", error);
		},
	});

	useEffect(() => {
		// Only run once when component mounts
		if (authenticatedCustomer && !updateOrderCustomerIdMutation.isSuccess) {
			// Check if order already has a customer
			const orderData = queryClient.getQueryData(
				getOrderByIdQueryOptions(orderId).queryKey,
			);

			// Only link if order doesn't have a customer yet
			if (orderData && !orderData.customerId) {
				updateOrderCustomerIdMutation.mutate({
					orderId,
					customerId: authenticatedCustomer.id,
				});
			}
		}
	}, [authenticatedCustomer, orderId]);

	return null;
}
