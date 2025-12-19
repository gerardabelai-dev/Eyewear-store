/**
 * Shared Brand Components
 * These components can be used in both the web app and email templates
 */

import { Store } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

// Brand configuration - centralized brand information
export const BRAND_CONFIG = {
	name: "ACME",
	cnpj: "12.345.678/0001-90",
	tagline: "Sua ótica online de confiança",
	email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contato@acme.com",
	website: process.env.NEXT_PUBLIC_WEB_URL || "https://www.acme.com",
	phone: "+55 (11) 1234-5678",
	address: "Rua Exemplo, 123 - Centro, São Paulo - SP, 01234-567",
	colors: {
		primary: "#0066CC", // Blue
		secondary: "#00A859", // Green
		accent: "#0066CC", // Using primary color instead of accent
		gray: {
			50: "#F9FAFB",
			100: "#F3F4F6",
			200: "#E5E7EB",
			300: "#D1D5DB",
			400: "#9CA3AF",
			500: "#6B7280",
			600: "#4B5563",
			700: "#374151",
			800: "#1F2937",
			900: "#111827",
		},
		text: "#1F2937",
	},
	social: {
		twitter: "https://twitter.com/acme",
		linkedin: "https://linkedin.com/company/acme",
		instagram: "https://instagram.com/acme",
		facebook: "https://facebook.com/acme",
	},
};

// Logo component for web app with theme switching
export function AppLogo({
	showText = true,
	className = "",
	size = "md",
}: {
	showText?: boolean;
	className?: string;
	size?: "sm" | "md" | "lg";
}) {
	const sizes = {
		sm: { icon: 20, text: "text-lg" },
		md: { icon: 24, text: "text-xl" },
		lg: { icon: 32, text: "text-2xl" },
	};

	const currentSize = sizes[size];

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary p-1.5 text-white">
				<Store size={currentSize.icon} strokeWidth={2} />
			</div>
			{showText && (
				<span
					className={`font-bold ${currentSize.text} text-gray-900 dark:text-white`}
				>
					{BRAND_CONFIG.name}
				</span>
			)}
		</div>
	);
}

// Logo for email templates (inline styles) - uses Store icon as inline SVG
export function EmailLogo({
	size = "md",
	showText = true,
}: {
	size?: "sm" | "md" | "lg";
	showText?: boolean;
}) {
	const sizes = {
		sm: { container: "28px", icon: "16px", textSize: "18px" },
		md: { container: "36px", icon: "20px", textSize: "20px" },
		lg: { container: "48px", icon: "28px", textSize: "24px" },
	};

	const currentSize = sizes[size];
	const iconSize = Number.parseInt(currentSize.icon);

	return (
		<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
			<div
				style={{
					width: currentSize.container,
					height: currentSize.container,
					borderRadius: "8px",
					background: `linear-gradient(135deg, ${BRAND_CONFIG.colors.primary} 0%, ${BRAND_CONFIG.colors.secondary} 100%)`,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{/* Inline SVG for Store icon - compatible with email clients */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={iconSize}
					height={iconSize}
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					role="img"
					aria-label={BRAND_CONFIG.name}
				>
					<title>{BRAND_CONFIG.name}</title>
					<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
					<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
					<path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
					<path d="M2 7h20" />
					<path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
				</svg>
			</div>
			{showText && (
				<span
					style={{
						fontWeight: "bold",
						fontSize: currentSize.textSize,
						color: BRAND_CONFIG.colors.text,
						fontFamily: "Arial, sans-serif",
					}}
				>
					{BRAND_CONFIG.name}
				</span>
			)}
		</div>
	);
}

// Company info component for app
export function AppCompanyInfo({
	variant = "full",
	className = "",
}: {
	variant?: "full" | "contact" | "minimal";
	className?: string;
}) {
	return (
		<div className={`text-gray-600 ${className}`}>
			{variant === "full" && (
				<div className="space-y-2">
					<div className="font-semibold text-gray-900">
						{BRAND_CONFIG.name} - {BRAND_CONFIG.tagline}
					</div>
					<div className="text-sm space-y-1">
						<div>Email: {BRAND_CONFIG.email}</div>
						<div>Telefone: {BRAND_CONFIG.phone}</div>
						<div>Endereço: {BRAND_CONFIG.address}</div>
					</div>
				</div>
			)}

			{variant === "contact" && (
				<div className="text-sm space-y-1">
					<div>{BRAND_CONFIG.email}</div>
					<div>{BRAND_CONFIG.phone}</div>
				</div>
			)}

			{variant === "minimal" && (
				<div className="text-sm">
					{BRAND_CONFIG.name} - {BRAND_CONFIG.tagline}
				</div>
			)}
		</div>
	);
}

// Company info for email templates
export function EmailCompanyInfo({
	variant = "full",
	style = {},
}: {
	variant?: "full" | "contact" | "minimal";
	style?: CSSProperties;
}) {
	const baseStyle: CSSProperties = {
		fontFamily: "Arial, sans-serif",
		color: BRAND_CONFIG.colors.gray[600],
		fontSize: "14px",
		lineHeight: "1.6",
		...style,
	};

	if (variant === "full") {
		return (
			<div style={baseStyle}>
				<div
					style={{
						fontWeight: "600",
						color: BRAND_CONFIG.colors.text,
						marginBottom: "8px",
					}}
				>
					{BRAND_CONFIG.name} - {BRAND_CONFIG.tagline}
				</div>
				<div style={{ fontSize: "12px" }}>
					<div>Email: {BRAND_CONFIG.email}</div>
					<div>Telefone: {BRAND_CONFIG.phone}</div>
					<div>Endereço: {BRAND_CONFIG.address}</div>
				</div>
			</div>
		);
	}

	if (variant === "contact") {
		return (
			<div style={{ ...baseStyle, fontSize: "12px" }}>
				<div>{BRAND_CONFIG.email}</div>
				<div>{BRAND_CONFIG.phone}</div>
			</div>
		);
	}

	return (
		<div style={{ ...baseStyle, fontSize: "12px" }}>
			{BRAND_CONFIG.name} - {BRAND_CONFIG.tagline}
		</div>
	);
}

// Social media links for app
export function AppSocialLinks({
	size = "md",
	className = "",
}: {
	size?: "sm" | "md" | "lg";
	className?: string;
}) {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-5 h-5",
		lg: "w-6 h-6",
	};

	return (
		<div className={`flex items-center gap-3 ${className}`}>
			{Object.entries(BRAND_CONFIG.social).map(([platform, url]) => (
				<a
					key={platform}
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className={`${sizeClasses[size]} text-gray-500`}
				>
					<span className="sr-only">{platform}</span>
					{/* You can replace these with actual icon components */}
					<div className={`${sizeClasses[size]} bg-gray-300 rounded`} />
				</a>
			))}
		</div>
	);
}

// Social media links for email
export function EmailSocialLinks({
	size = "md",
}: {
	size?: "sm" | "md" | "lg";
}) {
	const sizes = {
		sm: "16px",
		md: "20px",
		lg: "24px",
	};

	const iconSize = sizes[size];

	return (
		<div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
			{Object.entries(BRAND_CONFIG.social).map(([platform, url]) => (
				<a
					key={platform}
					href={url}
					style={{
						display: "inline-block",
						width: iconSize,
						height: iconSize,
						backgroundColor: BRAND_CONFIG.colors.gray[100],
						borderRadius: "4px",
						textDecoration: "none",
					}}
				>
					{/* You can replace with actual social icons */}
					<div
						style={{
							width: "100%",
							height: "100%",
							backgroundColor: BRAND_CONFIG.colors.gray[300],
							borderRadius: "4px",
						}}
					/>
				</a>
			))}
		</div>
	);
}

// Email button component with brand styling
export function EmailButton({
	href,
	children,
	variant = "primary",
	size = "md",
}: {
	href: string;
	children: ReactNode;
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
}) {
	const sizes = {
		sm: { padding: "8px 16px", fontSize: "12px" },
		md: { padding: "12px 24px", fontSize: "14px" },
		lg: { padding: "16px 32px", fontSize: "16px" },
	};

	const variants = {
		primary: {
			backgroundColor: BRAND_CONFIG.colors.primary,
			color: "white",
			border: "none",
		},
		secondary: {
			backgroundColor: BRAND_CONFIG.colors.secondary,
			color: "white",
			border: "none",
		},
		outline: {
			backgroundColor: "transparent",
			color: BRAND_CONFIG.colors.primary,
			border: `2px solid ${BRAND_CONFIG.colors.primary}`,
		},
	};

	const currentSize = sizes[size];
	const currentVariant = variants[variant];

	return (
		<a
			href={href}
			style={{
				display: "inline-block",
				padding: currentSize.padding,
				fontSize: currentSize.fontSize,
				fontWeight: "600",
				textDecoration: "none",
				borderRadius: "6px",
				fontFamily: "Arial, sans-serif",
				textAlign: "center",
				...currentVariant,
			}}
		>
			{children}
		</a>
	);
}

// Export brand configuration for use in other files
export { BRAND_CONFIG as default };
