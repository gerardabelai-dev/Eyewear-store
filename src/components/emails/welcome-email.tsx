import { Button, Heading, Section, Text } from "@react-email/components";
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
			preview={`Bem-vindo ao DrVista, ${name}! Sua conta foi criada com sucesso.`}
			title="Bem-vindo ao DrVista"
			unsubscribeUrl={unsubscribeUrl}
			userEmail={email}
			footerVariant="full"
		>
			{/* Welcome Section */}
			<Section className="px-6 py-8">
				<div className="text-center mb-8">
					<div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
						<div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
							<span className="text-white text-sm font-bold">✓</span>
						</div>
					</div>
					<Heading className="text-3xl font-bold text-brand-text mb-2">
						Bem-vindo ao DrVista!
					</Heading>
					<Text className="text-lg text-brand-gray">
						Sua conta foi criada com sucesso
					</Text>
				</div>
			</Section>

			{/* Greeting Section */}
			<Section className="px-6 py-0">
				<div className="bg-blue-50 p-6 rounded-lg mb-6">
					<Heading className="text-xl font-semibold text-brand-text mb-3">
						Olá, {name}!
					</Heading>
					<Text className="text-brand-text leading-relaxed mb-4">
						Obrigado por se juntar ao <strong>DrVista</strong>, seu sistema de
						gestão completo. Agora você pode acessar todas as funcionalidades da
						nossa plataforma e começar a gerenciar seus processos de forma mais
						eficiente.
					</Text>
					<Text className="text-brand-text leading-relaxed">
						Nossa equipe está sempre disponível para ajudá-lo a aproveitar ao
						máximo todas as ferramentas disponíveis.
					</Text>
				</div>
			</Section>

			{/* CTA Section */}
			<Section className="px-6 py-4 text-center">
				<Button
					href={`${BRAND_CONFIG.website}/account`}
					className="bg-brand-primary text-white px-8 py-4 rounded-lg font-semibold text-base text-center inline-block no-underline"
				>
					Acessar Dashboard
				</Button>
			</Section>

			{/* Features Section */}
			<Section className="px-6 py-6">
				<Heading className="text-xl font-semibold text-brand-text mb-4 text-center">
					O que você pode fazer no DrVista:
				</Heading>

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
			</Section>

			{/* Support Section */}
			<Section className="px-6 py-6">
				<div className="bg-gray-50 p-6 rounded-lg text-center">
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
				</div>
			</Section>
		</EmailLayout>
	);
}

export default WelcomeEmail;
