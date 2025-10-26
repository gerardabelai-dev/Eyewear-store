import { PageHeader } from "@/components/page-header";
import { getCurrentUser } from "@/lib/auth-server";
import { OrderList } from "./order-list";

export default async function CustomerOrdersPage() {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error("User not found");
	}

	return (
		<div className="mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
			<PageHeader
				title="Meus Pedidos"
				description="Verifique o status de pedidos recentes, gerencie devoluções e descubra produtos semelhantes."
			/>

			<OrderList />
		</div>
	);
}
