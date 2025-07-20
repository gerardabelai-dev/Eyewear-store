import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { BRAND_CONFIG } from "@/components/shared/brand";
import type { PasswordResetEmailData } from "@/lib/notifications/types";
import { EmailLayout } from "./shared/layout";

interface PasswordResetEmailProps extends PasswordResetEmailData {}

export function PasswordResetEmail({
	name,
	resetUrl,
	expiresIn = "1 hora",
	unsubscribeUrl,
}: PasswordResetEmailProps) {
	return (
		<EmailLayout
			preview={`${name ? `${name}, r` : "R"}edefinir sua senha no DrVista - Link válido por ${expiresIn}`}
			title="Redefinir Senha - DrVista"
			unsubscribeUrl={unsubscribeUrl}
			footerVariant="minimal"
			showSocialLinks={false}
		>
			{/* Warning Header */}
			<Section className="px-6 py-8">
				<div className="text-center mb-8">
					<div className="inline-block p-4 bg-red-100 rounded-full mb-4">
						<div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
							<span className="text-white text-sm font-bold">🔐</span>
						</div>
					</div>
					<Heading className="text-3xl font-bold text-brand-text mb-2">
						Redefinir Senha
					</Heading>
					<Text className="text-lg text-brand-gray">
						Solicitação de redefinição de senha
					</Text>
				</div>
			</Section>

			{/* Reset Info */}
			<Section className="px-6 py-0">
				<div className="bg-red-50 p-6 rounded-lg mb-6 border-l-4 border-red-600">
					<Heading className="text-xl font-semibold text-brand-text mb-3">
						{name ? `Olá, ${name}!` : "Olá!"}
					</Heading>
					<Text className="text-brand-text leading-relaxed mb-4">
						Recebemos uma solicitação para redefinir a senha da sua conta no{" "}
						<strong>DrVista</strong>. Se você não fez esta solicitação, pode
						ignorar este email com segurança.
					</Text>
					<Text className="text-brand-text leading-relaxed">
						Para criar uma nova senha, clique no botão abaixo. Este link é
						válido por <strong>{expiresIn}</strong>.
					</Text>
				</div>
			</Section>

			{/* CTA Section */}
			<Section className="px-6 py-8 text-center">
				<Button
					href={resetUrl}
					className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-base text-center inline-block no-underline"
				>
					Redefinir Senha
				</Button>
				<Text className="text-brand-gray text-sm mt-4">
					Este link expira em {expiresIn}
				</Text>
			</Section>

			{/* Security Tips */}
			<Section className="px-6 py-6">
				<Heading className="text-xl font-semibold text-brand-text mb-4 text-center">
					Dicas de Segurança
				</Heading>

				<div>
					<div className="flex items-start gap-3 mb-4">
						<div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
							<span className="text-white text-xs">🔒</span>
						</div>
						<div>
							<Text className="font-semibold text-brand-text mb-1">
								Use uma senha forte
							</Text>
							<Text className="text-brand-gray text-sm">
								Combine letras maiúsculas, minúsculas, números e símbolos
							</Text>
						</div>
					</div>

					<div className="flex items-start gap-3 mb-4">
						<div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
							<span className="text-white text-xs">👤</span>
						</div>
						<div>
							<Text className="font-semibold text-brand-text mb-1">
								Não compartilhe sua senha
							</Text>
							<Text className="text-brand-gray text-sm">
								Mantenha suas credenciais seguras e privadas
							</Text>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
							<span className="text-white text-xs">⚡</span>
						</div>
						<div>
							<Text className="font-semibold text-brand-text mb-1">
								Aja rapidamente
							</Text>
							<Text className="text-brand-gray text-sm">
								Este link expira em {expiresIn} por motivos de segurança
							</Text>
						</div>
					</div>
				</div>
			</Section>

			{/* Alternative Link Section */}
			<Section className="px-6 py-6">
				<div className="bg-gray-50 p-6 rounded-lg">
					<Text className="text-brand-text text-sm mb-3">
						<strong>Problemas com o botão?</strong>
					</Text>
					<Text className="text-brand-gray text-sm mb-4">
						Copie e cole este link no seu navegador:
					</Text>
					<div className="bg-white p-3 rounded border border-gray-200 text-xs break-all">
						<Text className="font-mono text-xs text-brand-text break-all">
							{resetUrl}
						</Text>
					</div>
				</div>
			</Section>

			{/* Support Section */}
			<Section className="px-6 py-6">
				<div className="bg-gray-50 p-6 rounded-lg text-center">
					<Text className="text-brand-text mb-2">
						<strong>Não foi você quem solicitou?</strong>
					</Text>
					<Text className="text-brand-gray text-sm mb-4">
						Se você não solicitou a redefinição, entre em contato conosco
						imediatamente
					</Text>
					<Text className="text-sm">
						<Button
							href={`mailto:${BRAND_CONFIG.email}?subject=Redefinição de senha suspeita`}
							className="text-brand-primary underline bg-transparent border-0 p-0 text-sm"
						>
							Reportar atividade suspeita
						</Button>
					</Text>
				</div>
			</Section>
		</EmailLayout>
	);
}

PasswordResetEmail.displayName = "PasswordResetEmail";
export default PasswordResetEmail;
