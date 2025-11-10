"use client";

import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { GetOrderResponse } from "@/http/types";

type OrderPrescriptionUploadProps = {
	order: GetOrderResponse["order"];
};

export function OrderPrescriptionUpload({
	order,
}: OrderPrescriptionUploadProps) {
	// Get all parent products (glasses) that have lens options requiring prescriptions
	const productsRequiringPrescription = useMemo(() => {
		if (!order.cart?.cartProducts) {
			return [];
		}

		// Get all parent products (glasses)
		const parentProducts = order.cart.cartProducts.filter(
			(cp) => !cp.parentProductId,
		);

		// Filter parent products that have child lens options requiring prescription
		return parentProducts.filter((parentProduct) => {
			const childLensOptions = order.cart?.cartProducts.filter(
				(cp) =>
					cp.parentProductId === parentProduct.productId &&
					cp.product.requiresPrescription,
			);
			return (childLensOptions?.length || 0) > 0;
		});
	}, [order.cart?.cartProducts]);

	// Check if there are any pending prescriptions
	const hasPendingPrescriptions = useMemo(() => {
		return productsRequiringPrescription.some(
			(cp) => cp.prescriptionStatus !== "uploaded",
		);
	}, [productsRequiringPrescription]);

	// Don't render if no products require prescription
	if (productsRequiringPrescription.length === 0) {
		return null;
	}

	return (
		<div className="space-y-6">
			{hasPendingPrescriptions ? (
				<Alert className="border-red-300 bg-red-500 text-white dark:bg-red-700/5 dark:border-red-500 dark:text-red-500">
					<AlertCircle className="h-4 w-4 text-white dark:text-red-500" />
					<AlertTitle className="text-white dark:text-red-500">
						Receita médica necessária
					</AlertTitle>
					<AlertDescription className="text-white/90 dark:text-red-500">
						Alguns produtos do seu pedido requerem uma receita médica. Clique em
						"Enviar receita" ao lado de cada produto pendente.
					</AlertDescription>
				</Alert>
			) : (
				<Alert className="border-green-300 bg-green-500 text-white dark:bg-transparent dark:border-green-700 dark:text-green-700">
					<AlertCircle className="h-4 w-4 text-white dark:text-green-700" />
					<AlertTitle className="text-white dark:text-green-700">
						Todas as receitas foram enviadas
					</AlertTitle>
					<AlertDescription className="text-white/90 dark:text-green-700/90">
						Obrigado! Recebemos todas as receitas necessárias. Seu pedido será
						processado em breve.
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
