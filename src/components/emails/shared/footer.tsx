import { Hr, Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
	BRAND_CONFIG,
	EmailCompanyInfo,
	EmailSocialLinks,
} from "@/components/shared/brand";

interface EmailFooterProps {
	unsubscribeUrl: string;
	userEmail?: string;
	showSocialLinks?: boolean;
	showFullContact?: boolean;
}

export function EmailFooter({
	unsubscribeUrl,
	userEmail,
	showSocialLinks = true,
	showFullContact = true,
}: EmailFooterProps) {
	return (
		<>
			{/* Divider */}
			<Hr className="border-gray-200 my-8" />

			{/* Footer content */}
			<Section className="bg-gray-50 px-6 py-8 text-center">
				{/* Company info */}
				<EmailCompanyInfo variant={showFullContact ? "full" : "minimal"} />

				{/* Social links */}
				{showSocialLinks && (
					<div className="flex justify-center mb-4">
						<EmailSocialLinks size="md" />
					</div>
				)}

				{/* Legal and unsubscribe */}
				<div className="border-t border-gray-300 pt-4 mt-4">
					{/* Unsubscribe link */}
					<Text className="text-xs text-gray-500 mb-2">
						Você está recebendo este email porque possui uma conta no Dr. Vista.
						{userEmail && (
							<>
								{" "}
								Email enviado para: <strong>{userEmail}</strong>
							</>
						)}
					</Text>

					<Text className="text-xs text-gray-500 mb-2">
						<Link
							href={unsubscribeUrl}
							className="text-brand-primary underline"
						>
							Cancelar inscrição
						</Link>
						{" | "}
						<Link
							href={`${BRAND_CONFIG.website}/privacidade`}
							className="text-brand-primary underline"
						>
							Política de Privacidade
						</Link>
						{" | "}
						<Link
							href={`${BRAND_CONFIG.website}/termos`}
							className="text-brand-primary underline"
						>
							Termos de Uso
						</Link>
					</Text>

					{/* Copyright */}
					<Text className="text-xs text-gray-400 mt-4">
						© {new Date().getFullYear()} {BRAND_CONFIG.name}. Todos os direitos
						reservados.
						<br />
						{BRAND_CONFIG.address}
					</Text>
				</div>
			</Section>
		</>
	);
}

// Minimal footer for transactional emails
export function EmailFooterMinimal({
	unsubscribeUrl,
	userEmail,
}: {
	unsubscribeUrl: string;
	userEmail?: string;
}) {
	return (
		<>
			<Hr className="border-gray-200 my-6" />
			<Section className="px-6 py-4 text-center">
				<EmailCompanyInfo variant="minimal" />

				<Text className="text-xs text-gray-500">
					{userEmail && (
						<>
							Email enviado para: <strong>{userEmail}</strong>
							<br />
						</>
					)}
					<Link href={unsubscribeUrl} className="text-brand-primary underline">
						Gerenciar preferências de email
					</Link>
					{" | "}
					<Link
						href={`${BRAND_CONFIG.website}/privacidade`}
						className="text-brand-primary underline"
					>
						Privacidade
					</Link>
				</Text>

				<Text className="text-xs text-gray-400 mt-2">
					© {new Date().getFullYear()} {BRAND_CONFIG.name}
				</Text>
			</Section>
		</>
	);
}
