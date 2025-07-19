import {
	Button,
	Container,
	Heading,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";
import { BRAND_CONFIG } from "@/components/shared/brand";
import type { OrderUpdateEmailData } from "@/lib/notifications/types";
import { cn } from "@/lib/utils";
import { EmailLayout } from "./shared/layout";

interface OrderUpdateEmailProps extends OrderUpdateEmailData {}

// Status configuration for styling and messaging
const statusConfig = {
	processing: {
		color: "#f59e0b",
		bgColor: "#fef3c7",
		icon: "⚙️",
		title: "Processando",
		description: "Seu pedido está sendo preparado",
	},
	shipped: {
		color: "#3b82f6",
		bgColor: "#dbeafe",
		icon: "🚚",
		title: "Enviado",
		description: "Seu pedido está a caminho",
	},
	delivered: {
		color: "#059669",
		bgColor: "#d1fae5",
		icon: "✅",
		title: "Entregue",
		description: "Seu pedido foi entregue com sucesso",
	},
	cancelled: {
		color: "#dc2626",
		bgColor: "#fee2e2",
		icon: "❌",
		title: "Cancelado",
		description: "Seu pedido foi cancelado",
	},
	returned: {
		color: "#6b7280",
		bgColor: "#f3f4f6",
		icon: "↩️",
		title: "Devolvido",
		description: "Seu pedido foi devolvido",
	},
} as const;

export function OrderUpdateEmail({
	orderNumber,
	customerName,
	status,
	message,
	trackingUrl,
	unsubscribeUrl,
}: OrderUpdateEmailProps) {
	const config =
		statusConfig[status as keyof typeof statusConfig] ||
		statusConfig.processing;

	return (
		<EmailLayout
			preview={`Pedido #${orderNumber} - Status: ${config.title}. ${message || config.description}`}
			title={`Atualização do Pedido - DrVista`}
			unsubscribeUrl={unsubscribeUrl}
			footerVariant="full"
		>
			{/* Status Header */}
			<Section className="px-6 py-8">
				<div className="text-center mb-8">
					<div
						className={cn(
							"inline-block p-4 rounded-full mb-4",
							status === "processing" && "bg-yellow-100",
							status === "shipped" && "bg-blue-100",
							status === "delivered" && "bg-green-100",
							status === "cancelled" && "bg-red-100",
							!["processing", "shipped", "delivered", "cancelled"].includes(
								status,
							) && "bg-gray-100",
						)}
					>
						<div
							className={cn(
								"w-8 h-8 rounded-full flex items-center justify-center",
								status === "processing" && "bg-yellow-600",
								status === "shipped" && "bg-blue-600",
								status === "delivered" && "bg-green-600",
								status === "cancelled" && "bg-red-600",
								!["processing", "shipped", "delivered", "cancelled"].includes(
									status,
								) && "bg-gray-600",
							)}
						>
							<span className="text-white text-sm">{config.icon}</span>
						</div>
					</div>
					<Heading className="text-3xl font-bold text-brand-text mb-2">
						{config.title}
					</Heading>
					<Text className="text-lg text-brand-gray">{config.description}</Text>
				</div>
			</Section>

			{/* Order Info */}
			<Section className="px-6 py-0">
				<div
					className={cn(
						"p-6 rounded-lg mb-6 border-l-4",
						status === "processing" && "bg-yellow-100 border-l-yellow-600",
						status === "shipped" && "bg-blue-100 border-l-blue-600",
						status === "delivered" && "bg-green-100 border-l-green-600",
						status === "cancelled" && "bg-red-100 border-l-red-600",
						!["processing", "shipped", "delivered", "cancelled"].includes(
							status,
						) && "bg-gray-100 border-l-gray-600",
					)}
				>
					<Heading className="text-xl font-semibold text-brand-text mb-3">
						Olá, {customerName}!
					</Heading>
					<Text className="text-brand-text leading-relaxed mb-4">
						Temos uma atualização sobre seu pedido{" "}
						<strong>#{orderNumber}</strong>.
					</Text>
					<Text className="text-brand-text leading-relaxed">
						<strong>Status atual:</strong> {config.title}
					</Text>
					{message && (
						<Text className="text-brand-text leading-relaxed mt-3">
							{message}
						</Text>
					)}
				</div>
			</Section>

			{/* Tracking Section - Only for shipped orders */}
			{status === "shipped" && trackingUrl && (
				<Section className="px-6 py-4">
					<div className="bg-blue-50 p-6 rounded-lg mb-6 text-center">
						<Heading className="text-lg font-semibold text-brand-text mb-3">
							🔍 Rastrear Envio
						</Heading>
						<Text className="text-brand-text mb-4">
							Acompanhe seu pedido em tempo real
						</Text>
						<Button
							href={trackingUrl}
							className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm text-center inline-block no-underline"
						>
							Rastrear Pedido
						</Button>
					</div>
				</Section>
			)}

			{/* Action Section */}
			<Section className="px-6 py-6 text-center">
				<Text className="text-brand-gray mb-4">
					Veja todos os detalhes do seu pedido
				</Text>
				<Button
					href={`${BRAND_CONFIG.website}/pedidos`}
					className="bg-brand-primary text-white px-8 py-4 rounded-lg font-semibold text-base text-center inline-block no-underline"
				>
					Ver Detalhes do Pedido
				</Button>
			</Section>

			{/* Status-specific information */}
			{status === "delivered" && (
				<Section className="px-6 py-6">
					<div className="bg-green-50 p-6 rounded-lg text-center">
						<Heading className="text-lg font-semibold text-brand-text mb-3">
							🎉 Obrigado pela sua compra!
						</Heading>
						<Text className="text-brand-text mb-4">
							Esperamos que você esteja satisfeito com seu pedido. Sua opinião é
							muito importante para nós!
						</Text>
						<Button
							href={`${BRAND_CONFIG.website}/avaliar?pedido=${orderNumber}`}
							className="bg-brand-secondary text-white px-6 py-3 rounded-lg font-semibold text-sm text-center inline-block no-underline"
						>
							Avaliar Compra
						</Button>
					</div>
				</Section>
			)}

			{status === "cancelled" && (
				<Section className="px-6 py-6">
					<div className="bg-red-50 p-6 rounded-lg text-center">
						<Heading className="text-lg font-semibold text-brand-text mb-3">
							Pedido Cancelado
						</Heading>
						<Text className="text-brand-text mb-4">
							Seu pedido foi cancelado conforme solicitado. Se o pagamento foi
							processado, o estorno será feito em até 5 dias úteis.
						</Text>
						<Text className="text-sm text-brand-gray">
							Dúvidas sobre o cancelamento? Entre em contato conosco.
						</Text>
					</div>
				</Section>
			)}

			{/* Timeline for processing/shipped orders */}
			{(status === "processing" || status === "shipped") && (
				<Section className="px-6 py-6">
					<Heading className="text-xl font-semibold text-brand-text mb-4 text-center">
						Acompanhe seu Pedido
					</Heading>

					<div>
						<div className="flex items-start gap-3 mb-4">
							<div className="w-8 h-8 rounded-full flex items-center justify-center mt-1 bg-green-600">
								<span className="text-white text-xs font-bold">✓</span>
							</div>
							<div>
								<Text className="font-semibold text-brand-text mb-1">
									Pedido Confirmado
								</Text>
								<Text className="text-brand-gray text-sm">
									Seu pedido foi recebido e confirmado
								</Text>
							</div>
						</div>

						<div className="flex items-start gap-3 mb-4">
							<div
								className={cn(
									"w-8 h-8 rounded-full flex items-center justify-center mt-1",
									status === "processing" || status === "shipped"
										? "bg-green-600"
										: "bg-gray-200",
								)}
							>
								<span
									className={cn(
										"text-xs font-bold",
										status === "processing" || status === "shipped"
											? "text-white"
											: "text-gray-500",
									)}
								>
									{status === "processing" || status === "shipped" ? "✓" : "2"}
								</span>
							</div>
							<div>
								<Text className="font-semibold text-brand-text mb-1">
									Preparando Envio
								</Text>
								<Text className="text-brand-gray text-sm">
									Seus itens estão sendo preparados
								</Text>
							</div>
						</div>

						<div className="flex items-start gap-3 mb-4">
							<div
								className={cn(
									"w-8 h-8 rounded-full flex items-center justify-center mt-1",
									status === "shipped" ? "bg-green-600" : "bg-gray-200",
								)}
							>
								<span
									className={cn(
										"text-xs font-bold",
										status === "shipped" ? "text-white" : "text-gray-500",
									)}
								>
									{status === "shipped" ? "✓" : "3"}
								</span>
							</div>
							<div>
								<Text className="font-semibold text-brand-text mb-1">
									Enviado
								</Text>
								<Text className="text-brand-gray text-sm">
									Pedido despachado para entrega
								</Text>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mt-1">
								<span className="text-gray-500 text-xs font-bold">4</span>
							</div>
							<div>
								<Text className="font-semibold text-brand-text mb-1">
									Entregue
								</Text>
								<Text className="text-brand-gray text-sm">
									Pedido entregue no endereço
								</Text>
							</div>
						</div>
					</div>
				</Section>
			)}

			{/* Support Section */}
			<Section className="px-6 py-6">
				<div className="bg-gray-50 p-6 rounded-lg text-center">
					<Text className="text-brand-text mb-2">
						<strong>Dúvidas sobre seu pedido?</strong>
					</Text>
					<Text className="text-brand-gray text-sm mb-4">
						Nossa equipe está pronta para ajudar você
					</Text>
					<Text className="text-sm">
						<Button
							href={`mailto:${BRAND_CONFIG.email}?subject=Dúvida sobre pedido ${orderNumber}`}
							className="text-brand-primary underline bg-transparent border-0 p-0 text-sm"
						>
							Entrar em contato
						</Button>
					</Text>
				</div>
			</Section>
		</EmailLayout>
	);
}

export default OrderUpdateEmail;
