import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { getCustomerOrdersQueryOptions } from "@/http/orders/queries";
import { getCurrentUser } from "@/lib/auth-server";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { OrderList } from "./order-list";

export default async function CustomerOrdersPage() {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error("User not found");
	}

	// Prefetch orders data on the server
	const queryClient = getQueryClient();
	await queryClient.prefetchQuery(getCustomerOrdersQueryOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
				<PageHeader
					title="Meus Pedidos"
					description="Verifique o status de pedidos recentes, gerencie devoluções e descubra produtos semelhantes."
				/>

				<OrderList />
			</div>
		</HydrationBoundary>
	);
}
