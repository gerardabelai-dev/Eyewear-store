import {
	Body,
	Container,
	Head,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import { pixelBasedPreset, Tailwind } from "@react-email/tailwind";
import * as React from "react";
import { BRAND_CONFIG, EmailLogo } from "@/components/shared/brand";

interface EmailHeaderProps {
	preview: string;
	title?: string;
	lang?: string;
}

export function EmailHeader({
	preview,
	title = "DrVista",
	lang = "pt-BR",
}: EmailHeaderProps) {
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
					<Container className="max-w-2xl mx-auto bg-white">
						{/* Header with logo */}
						<Section className="bg-white px-6 py-8 border-b border-gray-200">
							<EmailLogo size="lg" showText={true} />
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

interface EmailBodyHeaderProps {
	title?: string;
	subtitle?: string;
	showLogo?: boolean;
}

// Simple header for use inside email body (without Html wrapper)
export function EmailBodyHeader({
	title = "Dr. Vista",
	subtitle,
	showLogo = true,
}: EmailBodyHeaderProps) {
	return (
		<Section className="bg-white px-6 py-8 border-b border-gray-200">
			{showLogo && <EmailLogo size="lg" showText={true} />}
			<Text className="text-lg font-bold mt-2">{title}</Text>
			{subtitle && (
				<Text className="text-sm text-gray-600 mt-1">{subtitle}</Text>
			)}
		</Section>
	);
}
