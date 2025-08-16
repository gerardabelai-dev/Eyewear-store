import { getOrderByIdQueryOptions } from "@/http/orders/queries";

export const getOrderSuccessQueryOptions = (orderId: string) =>
	getOrderByIdQueryOptions(orderId);
