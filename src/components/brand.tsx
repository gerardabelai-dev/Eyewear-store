/**
 * Shared Brand Components
 * These components can be used in both the web app and email templates
 */

import Image from "next/image";
import type * as React from "react";

// Brand configuration - centralized brand information
export const BRAND_CONFIG = {
	name: "Dr. Vista",
	cnpj: "12.345.678/0001-90",
	tagline: "Sua ótica online de confiança",
	email: "contato@drvista.com.br",
	website: "https://www.drvista.com.br",
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
		twitter: "https://twitter.com/drvista",
		linkedin: "https://linkedin.com/company/drvista",
		instagram: "https://instagram.com/drvista",
		facebook: "https://facebook.com/drvista",
	},
};

// Logo component for web app with theme switching
export function AppLogo({
	showText = true,
	className = "",
}: {
	showText?: boolean;
	className?: string;
}) {
	if (!showText) {
		// Logo only - use the favicon SVG
		return (
			<div className={`flex items-center ${className}`}>
				<Image
					src="/drvista-favicon.svg"
					alt="Dr. Vista"
					width={32}
					height={32}
					className="object-contain size-8"
				/>
			</div>
		);
	}

	// Full logo with text - use CSS to handle theme switching to avoid hydration mismatch
	return (
		<div className={`flex items-center ${className}`}>
			{/* Light theme logo - hidden in dark mode */}
			<Image
				src="/drvista-logo-light.svg"
				alt="Dr. Vista"
				width={140}
				height={32}
				className="object-contain w-28 dark:hidden"
			/>
			{/* Dark theme logo - hidden in light mode */}
			<Image
				src="/drvista-logo-dark.svg"
				alt="Dr. Vista"
				width={140}
				height={32}
				className="object-contain w-28 hidden dark:block"
			/>
		</div>
	);
}

// Logo for email templates (inline styles) - keeps using the old approach since emails don't support theme switching
export function EmailLogo({
	size = "md",
	showText = true,
}: {
	size?: "sm" | "md" | "lg";
	showText?: boolean;
}) {
	const sizes = {
		sm: { width: "24px", height: "24px", fontSize: "10px", textSize: "18px" },
		md: { width: "32px", height: "32px", fontSize: "12px", textSize: "20px" },
		lg: { width: "48px", height: "48px", fontSize: "16px", textSize: "24px" },
	};

	const currentSize = sizes[size];

	return (
		<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
			<div
				style={{
					width: currentSize.width,
					height: currentSize.height,
					borderRadius: "8px",
					background: `linear-gradient(135deg, ${BRAND_CONFIG.colors.primary} 0%, ${BRAND_CONFIG.colors.secondary} 100%)`,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "white",
					fontWeight: "bold",
					fontSize: currentSize.fontSize,
				}}
			>
				Dr
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
	style?: React.CSSProperties;
}) {
	const baseStyle: React.CSSProperties = {
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
	children: React.ReactNode;
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
