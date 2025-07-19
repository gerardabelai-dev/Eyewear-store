import {
	Button,
	Column,
	Heading,
	Row,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";
import { BRAND_CONFIG } from "@/components/shared/brand";
import type { OrderConfirmationEmailData } from "@/lib/notifications/types";
import { cn } from "@/lib/utils";
import { EmailLayout } from "./shared/layout";

interface OrderConfirmationEmailProps extends OrderConfirmationEmailData {}

export function OrderConfirmationEmail({
	orderNumber,
	customerName,
	total,
	items,
	unsubscribeUrl,
}: OrderConfirmationEmailProps) {
	return (
		<EmailLayout
			preview={`Pedido #${orderNumber} confirmado! Obrigado pela sua compra, ${customerName}.`}
			title="Pedido Confirmado - DrVista"
			unsubscribeUrl={unsubscribeUrl}
			footerVariant="full"
		>
			{/* Success Header */}
			<Section className="px-6 py-8">
				<div className="text-center mb-8">
					<div className="inline-block p-4 bg-green-100 rounded-full mb-4">
						<div className="w-8 h-8 bg-brand-secondary rounded-full flex items-center justify-center">
							<span className="text-white text-sm font-bold">✓</span>
						</div>
					</div>
					<Heading className="text-3xl font-bold text-brand-text mb-2">
						Pedido Confirmado!
					</Heading>
					<Text className="text-lg text-brand-gray">
						Seu pedido foi recebido e está sendo processado
					</Text>
				</div>
			</Section>

			{/* Order Info */}
			<Section className="px-6 py-0">
				<div className="bg-green-50 p-6 rounded-lg mb-6">
					<Heading className="text-xl font-semibold text-brand-text mb-3">
						Olá, {customerName}!
					</Heading>
					<Text className="text-brand-text leading-relaxed mb-4">
						Obrigado pela sua compra! Seu pedido <strong>#{orderNumber}</strong>{" "}
						foi confirmado e nossa equipe já está preparando os itens para o
						envio.
					</Text>
					<Text className="text-brand-text leading-relaxed">
						Você receberá uma notificação por email assim que seu pedido for
						despachado, junto com o código de rastreamento.
					</Text>
				</div>
			</Section>

			{/* Order Details */}
			<Section className="px-6 py-4">
				<Heading className="text-xl font-semibold text-brand-text mb-4">
					Detalhes do Pedido #${orderNumber}
				</Heading>

				{/* Order Items Table */}
				<div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
					{/* Table Header */}
					<div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
						<Row>
							<Column className="w-1/2">
								<Text className="font-semibold text-brand-text text-sm">
									Produto
								</Text>
							</Column>
							<Column className="w-1/4 text-center">
								<Text className="font-semibold text-brand-text text-sm">
									Qtd
								</Text>
							</Column>
							<Column className="w-1/4 text-right">
								<Text className="font-semibold text-brand-text text-sm">
									Preço
								</Text>
							</Column>
						</Row>
					</div>

					{/* Table Body */}
					<div className="bg-white">
						{items.map((item, index) => (
							<div
								key={`${item.name}-${index}`}
								className={cn(
									"px-4 py-3",
									index < items.length - 1 && "border-b border-gray-100",
								)}
							>
								<Row>
									<Column className="w-1/2">
										<Text className="text-brand-text text-sm">{item.name}</Text>
									</Column>
									<Column className="w-1/4 text-center">
										<Text className="text-brand-text text-sm">
											{item.quantity}
										</Text>
									</Column>
									<Column className="w-1/4 text-right">
										<Text className="text-brand-text text-sm">
											R$ {item.price.toFixed(2)}
										</Text>
									</Column>
								</Row>
							</div>
						))}

						{/* Total Row */}
						<div className="bg-gray-50 px-4 py-3 border-t-2 border-brand-primary">
							<Row>
								<Column className="w-3/4">
									<Text className="font-bold text-brand-text">Total:</Text>
								</Column>
								<Column className="w-1/4 text-right">
									<Text className="font-bold text-brand-text text-lg">
										R$ {total.toFixed(2)}
									</Text>
								</Column>
							</Row>
						</div>
					</div>
				</div>
			</Section>

			{/* CTA Section */}
			<Section className="px-6 py-6 text-center">
				<Text className="text-brand-gray mb-4">
					Acompanhe o status do seu pedido a qualquer momento
				</Text>
				<Button
					href={`${BRAND_CONFIG.website}/pedidos`}
					className="bg-brand-secondary text-white px-8 py-4 rounded-lg font-semibold text-base text-center inline-block no-underline"
				>
					Ver Detalhes do Pedido
				</Button>
			</Section>

			{/* Next Steps */}
			<Section className="px-6 py-6">
				<Heading className="text-xl font-semibold text-brand-text mb-4 text-center">
					Próximos Passos
				</Heading>

				<div>
					<div className="flex items-start gap-3 mb-4">
						<div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center mt-1">
							<span className="text-white text-xs font-bold">1</span>
						</div>
						<div>
							<Text className="font-semibold text-brand-text mb-1">
								Processamento
							</Text>
							<Text className="text-brand-gray text-sm">
								Estamos preparando seus itens com todo cuidado
							</Text>
						</div>
					</div>

					<div className="flex items-start gap-3 mb-4">
						<div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center mt-1">
							<span className="text-white text-xs font-bold">2</span>
						</div>
						<div>
							<Text className="font-semibold text-brand-text mb-1">Envio</Text>
							<Text className="text-brand-gray text-sm">
								Você receberá o código de rastreamento por email
							</Text>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center mt-1">
							<span className="text-white text-xs font-bold">3</span>
						</div>
						<div>
							<Text className="font-semibold text-brand-text mb-1">
								Entrega
							</Text>
							<Text className="text-brand-gray text-sm">
								Seus produtos chegam até você em segurança
							</Text>
						</div>
					</div>
				</div>
			</Section>

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

export default OrderConfirmationEmail;
