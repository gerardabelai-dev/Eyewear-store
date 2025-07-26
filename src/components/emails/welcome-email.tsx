import {
	Button,
	Container,
	Heading,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";
import { BRAND_CONFIG } from "@/components/shared/brand";
import type { WelcomeEmailData } from "@/lib/notifications/types";
import { EmailLayout } from "./shared/layout";

interface WelcomeEmailProps extends WelcomeEmailData {}

export function WelcomeEmail({
	name,
	email,
	unsubscribeUrl,
}: WelcomeEmailProps) {
	return (
		<EmailLayout
			preview={`Bem-vindo ao Dr. Vista, ${name}! Sua conta foi criada com sucesso.`}
			title="Bem-vindo ao Dr. Vista"
			unsubscribeUrl={unsubscribeUrl}
			userEmail={email}
			footerVariant="full"
			showSocialLinks={true}
		>
			{/* Welcome Section */}
			<Section className="px-6 py-8">
				<Heading className="text-2xl font-bold text-gray-900 mb-4">
					Bem-vindo ao Dr. Vista!
				</Heading>

				<Text className="text-base text-gray-700 mb-4">Olá {name},</Text>

				<Text className="text-base text-gray-700 mb-6">
					Obrigado por se juntar ao <strong>Dr. Vista</strong>, seu sistema de
					gestão completo para clínicas e consultórios médicos.
				</Text>

				{/* CTA Button */}
				<div className="text-center mb-6">
					<Button
						href={`${BRAND_CONFIG.website}/dashboard`}
						className="bg-brand-primary text-white px-6 py-3 rounded-md font-medium"
					>
						Acessar Minha Conta
					</Button>
				</div>

				{/* Features Section */}
				<Container className="bg-gray-50 rounded-lg p-6 mb-6">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						O que você pode fazer no Dr. Vista:
					</Text>

					<div>
						<div className="flex items-start gap-3 mb-4">
							<div className="w-6 h-6 bg-brand-secondary rounded-full flex items-center justify-center mt-1">
								<span className="text-white text-xs">📊</span>
							</div>
							<div>
								<Text className="font-semibold text-brand-text mb-1">
									Gestão de Produtos
								</Text>
								<Text className="text-brand-gray text-sm">
									Organize e controle seu estoque de forma inteligente
								</Text>
							</div>
						</div>

						<div className="flex items-start gap-3 mb-4">
							<div className="w-6 h-6 bg-brand-secondary rounded-full flex items-center justify-center mt-1">
								<span className="text-white text-xs">📋</span>
							</div>
							<div>
								<Text className="font-semibold text-brand-text mb-1">
									Controle de Pedidos
								</Text>
								<Text className="text-brand-gray text-sm">
									Acompanhe todos os seus pedidos em tempo real
								</Text>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<div className="w-6 h-6 bg-brand-secondary rounded-full flex items-center justify-center mt-1">
								<span className="text-white text-xs">📈</span>
							</div>
							<div>
								<Text className="font-semibold text-brand-text mb-1">
									Relatórios Detalhados
								</Text>
								<Text className="text-brand-gray text-sm">
									Analise o desempenho do seu negócio com dados precisos
								</Text>
							</div>
						</div>
					</div>
				</Container>

				{/* Support Section */}
				<Container className="bg-gray-50 rounded-lg p-6 text-center">
					<Text className="text-brand-text mb-2">
						<strong>Precisa de ajuda?</strong>
					</Text>
					<Text className="text-brand-gray text-sm mb-4">
						Nossa equipe de suporte está sempre pronta para ajudá-lo
					</Text>
					<Text className="text-sm">
						<Button
							href={`mailto:${BRAND_CONFIG.email}`}
							className="text-brand-primary underline bg-transparent border-0 p-0 text-sm"
						>
							{BRAND_CONFIG.email}
						</Button>
						{" | "}
						<Button
							href={`tel:${BRAND_CONFIG.phone}`}
							className="text-brand-primary underline bg-transparent border-0 p-0 text-sm"
						>
							{BRAND_CONFIG.phone}
						</Button>
					</Text>
				</Container>
			</Section>
		</EmailLayout>
	);
}

WelcomeEmail.displayName = "WelcomeEmail";
export default WelcomeEmail;
