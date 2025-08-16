import { Separator } from "@/components/ui/separator";
import type { GetOrderResponse } from "@/http/types";

interface OrderDetailsProps {
	order: GetOrderResponse["order"];
}

export function OrderDetails({ order }: OrderDetailsProps) {
	const customerAddress = order.customerAddress;
	const customer = order.customer;
	const paymentMethod = order.payment?.orderPaymentMethod;
	const deliveryMethod = order.delivery?.orderDeliveryMethod;

	return (
		<>
			<Separator className="my-6" />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="flex flex-col gap-4">
					<h3 className="text-sm font-bold">Endereço de entrega</h3>
					{customerAddress && customer ? (
						<>
							<span className="text-sm text-muted-foreground">
								{customer.firstName} {customer.lastName}
							</span>
							<span className="text-sm text-muted-foreground">
								{customerAddress.street}
								{customerAddress.number && `, ${customerAddress.number}`}
								{customerAddress.complement &&
									`, ${customerAddress.complement}`}
							</span>
							<span className="text-sm text-muted-foreground">
								{customerAddress.neighborhood}, {customerAddress.city} -{" "}
								{customerAddress.state}
							</span>
							{customerAddress.zipCode && (
								<span className="text-sm text-muted-foreground">
									CEP: {customerAddress.zipCode}
								</span>
							)}
						</>
					) : (
						<span className="text-sm text-muted-foreground">
							Endereço não disponível
						</span>
					)}
				</div>

				<div className="flex flex-col gap-4">
					<h3 className="text-sm font-bold">Endereço de cobrança</h3>
					{customerAddress && customer ? (
						<>
							<span className="text-sm text-muted-foreground">
								{customer.firstName} {customer.lastName}
							</span>
							<span className="text-sm text-muted-foreground">
								{customerAddress.street}
								{customerAddress.number && `, ${customerAddress.number}`}
								{customerAddress.complement &&
									`, ${customerAddress.complement}`}
							</span>
							<span className="text-sm text-muted-foreground">
								{customerAddress.neighborhood}, {customerAddress.city} -{" "}
								{customerAddress.state}
							</span>
							{customerAddress.zipCode && (
								<span className="text-sm text-muted-foreground">
									CEP: {customerAddress.zipCode}
								</span>
							)}
						</>
					) : (
						<span className="text-sm text-muted-foreground">
							Endereço não disponível
						</span>
					)}
				</div>
			</div>

			<Separator className="my-6" />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="flex flex-col gap-4">
					<h3 className="text-sm font-bold">Método de pagamento</h3>
					{paymentMethod ? (
						<>
							<span className="text-sm text-muted-foreground">
								{paymentMethod.method}
							</span>
							<span className="text-sm text-muted-foreground">
								Status:{" "}
								{order.payment?.orderPaymentStatus === "paid"
									? "Pago"
									: "Pendente"}
							</span>
						</>
					) : (
						<span className="text-sm text-muted-foreground">
							Método de pagamento não disponível
						</span>
					)}
				</div>

				<div className="flex flex-col gap-4">
					<h3 className="text-sm font-bold">Método de envio</h3>
					{deliveryMethod ? (
						<>
							<span className="text-sm text-muted-foreground">
								{deliveryMethod.method}
							</span>
							<span className="text-sm text-muted-foreground">
								Status:{" "}
								{order.delivery?.orderDeliveryStatus === "delivered"
									? "Entregue"
									: order.delivery?.orderDeliveryStatus === "shipped"
										? "Enviado"
										: order.delivery?.orderDeliveryStatus === "processing"
											? "Processando"
											: "Pendente"}
							</span>
						</>
					) : (
						<span className="text-sm text-muted-foreground">
							Método de envio não disponível
						</span>
					)}
				</div>
			</div>
		</>
	);
}
