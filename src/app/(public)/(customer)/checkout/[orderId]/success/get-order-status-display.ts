import type { Order } from "@/lib/db/schema";

export function getOrderStatusDisplay(orderStatus: Order["orderStatus"]) {
	switch (orderStatus) {
		case "paid":
			return {
				title: "Pedido confirmado",
				description: "Seu pedido foi confirmado e será processado em breve",
			};
		case "awaiting_prescription":
			return {
				title: "Aguardando receita médica",
				description:
					"Seu pedido requer o envio de receita médica. Por favor, faça o upload abaixo para darmos continuidade",
			};
		case "cancelled":
			return {
				title: "Pedido cancelado",
				description: "Este pedido foi cancelado",
			};
		default:
			return {
				title: "Pedido em análise",
				description: "Seu pedido está sendo analisado e será enviado em breve",
			};
	}
}
