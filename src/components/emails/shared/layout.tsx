import { Body, Container, Head, Html, Preview } from "@react-email/components";
import { pixelBasedPreset, Tailwind } from "@react-email/tailwind";
import type * as React from "react";
import { BRAND_CONFIG } from "@/components/shared/brand";
import { EmailFooter, EmailFooterMinimal } from "./footer";
import { EmailBodyHeader } from "./header";

interface EmailLayoutProps {
	children: React.ReactNode;
	preview: string;
	title?: string;
	lang?: string;
	unsubscribeUrl: string;
	userEmail?: string;
	footerVariant?: "full" | "minimal";
	showSocialLinks?: boolean;
}

export function EmailLayout({
	children,
	preview,
	title = "Dr. Vista",
	lang = "pt-BR",
	unsubscribeUrl,
	userEmail,
	footerVariant = "full",
	showSocialLinks = true,
}: EmailLayoutProps) {
	return (
		<Html lang={lang}>
			<Head>
				<title>{title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
				{/* Prevent Gmail threading by adding unique meta data */}
				<meta
					name="message-id"
					content={`${Date.now()}-${Math.random().toString(36)}`}
				/>
				<meta name="date" content={new Date().toISOString()} />
			</Head>
			<Preview>{preview}</Preview>
			<Tailwind
				config={{
					presets: [pixelBasedPreset],
					theme: {
						extend: {
							colors: {
								brand: {
									primary: BRAND_CONFIG.colors.primary,
									secondary: BRAND_CONFIG.colors.secondary,
									accent: BRAND_CONFIG.colors.accent,
									gray: BRAND_CONFIG.colors.gray,
									text: BRAND_CONFIG.colors.text,
								},
							},
							fontFamily: {
								sans: ["Arial", "sans-serif"],
							},
						},
					},
				}}
			>
				<Body className="bg-gray-50 font-sans">
					<Container className="max-w-2xl mx-auto bg-white shadow-lg">
						{/* Header */}
						<EmailBodyHeader />

						{/* Main content */}
						{children}

						{/* Footer */}
						{footerVariant === "minimal" ? (
							<EmailFooterMinimal
								unsubscribeUrl={unsubscribeUrl}
								userEmail={userEmail}
							/>
						) : (
							<EmailFooter
								unsubscribeUrl={unsubscribeUrl}
								userEmail={userEmail}
								showSocialLinks={showSocialLinks}
								showFullContact={true}
							/>
						)}
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
