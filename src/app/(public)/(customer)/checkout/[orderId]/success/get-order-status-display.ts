import type { GetOrderResponse } from "@/http/types";

interface PrescriptionInfo {
	requiresPrescription: boolean;
	allUploaded: boolean;
}

type OrderWithDetails = GetOrderResponse["order"];

function getPrescriptionInfo(order: OrderWithDetails): PrescriptionInfo {
	if (!order.cart?.cartProducts) {
		return { requiresPrescription: false, allUploaded: false };
	}

	// Get all parent products (glasses)
	const parentProducts = order.cart.cartProducts.filter(
		(cp) => !cp.parentProductId,
	);

	// Filter parent products that have child lens options requiring prescription
	const productsRequiringPrescription = parentProducts.filter(
		(parentProduct) => {
			const childLensOptions = order.cart?.cartProducts.filter(
				(cp) =>
					cp.parentProductId === parentProduct.productId &&
					cp.product.requiresPrescription,
			);
			return (childLensOptions?.length || 0) > 0;
		},
	);

	if (productsRequiringPrescription.length === 0) {
		return { requiresPrescription: false, allUploaded: false };
	}

	// Check if all prescriptions are uploaded
	const allUploaded = productsRequiringPrescription.every(
		(cp) => cp.prescriptionStatus === "uploaded",
	);

	return {
		requiresPrescription: true,
		allUploaded,
	};
}

export function getOrderStatusDisplay(order: OrderWithDetails) {
	const prescriptionInfo = getPrescriptionInfo(order);
	const orderStatus = order.orderStatus;
	const deliveryStatus = order.delivery?.orderDeliveryStatus;

	// Handle cancelled orders first
	if (orderStatus === "cancelled") {
		return {
			title: "Pedido cancelado",
			description: "Este pedido foi cancelado",
		};
	}

	// Handle delivery statuses
	if (deliveryStatus === "delivered") {
		return {
			title: "Pedido entregue",
			description: "Seu pedido foi entregue com sucesso",
		};
	}

	if (deliveryStatus === "shipped") {
		return {
			title: "Pedido enviado",
			description: "Seu pedido foi despachado e está a caminho",
		};
	}

	if (deliveryStatus === "processing") {
		return {
			title: "Pedido em preparação",
			description: "Seu pedido está sendo preparado em nosso laboratório",
		};
	}

	// Handle prescription status
	if (
		orderStatus === "awaiting_prescription" &&
		prescriptionInfo.requiresPrescription
	) {
		if (prescriptionInfo.allUploaded) {
			return {
				title: "Receita recebida",
				description:
					"Receita médica recebida com sucesso. Seu pedido será encaminhado para preparação",
			};
		}
		return {
			title: "Aguardando receita médica",
			description:
				"Seu pedido requer o envio de receita médica. Por favor, faça o upload abaixo para darmos continuidade",
		};
	}

	// Handle paid status
	if (orderStatus === "paid") {
		return {
			title: "Pedido confirmado",
			description: "Seu pedido foi confirmado e será processado em breve",
		};
	}

	// Default case
	return {
		title: "Pedido em análise",
		description: "Seu pedido está sendo analisado e será enviado em breve",
	};
}
