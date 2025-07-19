/**
 * Shared Brand Components
 * These components can be used in both the web app and email templates
 */

import type * as React from "react";

// Brand configuration constants
export const BRAND_CONFIG = {
	name: "DrVista",
	tagline: "Sistema de Gestão",
	email: "contato@drvista.com.br",
	website: "https://www.drvista.com.br",
	phone: "+55 (11) 99999-9999",
	address: "São Paulo, SP - Brasil",
	colors: {
		primary: "#2563eb",
		primaryDark: "#1e40af",
		secondary: "#059669",
		accent: "#f59e0b",
		gray: "#6b7280",
		lightGray: "#f9fafb",
		border: "#e5e7eb",
		text: "#374151",
		background: "#ffffff",
	},
	social: {
		twitter: "https://twitter.com/drvista",
		linkedin: "https://linkedin.com/company/drvista",
		instagram: "https://instagram.com/drvista",
		facebook: "https://facebook.com/drvista",
	},
} as const;

// Logo component for web app
export function AppLogo({
	size = "md",
	showText = true,
	className = "",
}: {
	size?: "sm" | "md" | "lg" | "xl";
	showText?: boolean;
	className?: string;
}) {
	const sizeClasses = {
		sm: "h-6 w-6",
		md: "h-8 w-8",
		lg: "h-12 w-12",
		xl: "h-16 w-16",
	};

	const textSizeClasses = {
		sm: "text-lg",
		md: "text-xl",
		lg: "text-2xl",
		xl: "text-3xl",
	};

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<div
				className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold`}
				style={{ backgroundColor: BRAND_CONFIG.colors.primary }}
			>
				<span className="text-sm">Dr</span>
			</div>
			{showText && (
				<span
					className={`font-bold ${textSizeClasses[size]}`}
					style={{ color: BRAND_CONFIG.colors.text }}
				>
					{BRAND_CONFIG.name}
				</span>
			)}
		</div>
	);
}

// Logo for email templates (inline styles)
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
					background: `linear-gradient(135deg, ${BRAND_CONFIG.colors.primary} 0%, ${BRAND_CONFIG.colors.primaryDark} 100%)`,
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
		color: BRAND_CONFIG.colors.gray,
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
						backgroundColor: BRAND_CONFIG.colors.lightGray,
						borderRadius: "4px",
						textDecoration: "none",
					}}
				>
					{/* You can replace with actual social icons */}
					<div
						style={{
							width: "100%",
							height: "100%",
							backgroundColor: BRAND_CONFIG.colors.gray,
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
