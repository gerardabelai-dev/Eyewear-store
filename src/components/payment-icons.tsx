import type { SVGProps } from "react";

export function VisaIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 40 24"
			fill="none"
			className="w-10 h-6"
			aria-label="Visa"
			role="img"
			{...props}
		>
			<title>Visa</title>
			<rect width="40" height="24" rx="4" fill="#1A1F71" />
			<text
				x="20"
				y="15"
				textAnchor="middle"
				fill="white"
				fontSize="8"
				fontWeight="bold"
				fontFamily="Arial, sans-serif"
			>
				VISA
			</text>
		</svg>
	);
}

export function MastercardIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 40 24"
			fill="none"
			className="w-10 h-6"
			aria-label="Mastercard"
			role="img"
			{...props}
		>
			<title>Mastercard</title>
			<rect width="40" height="24" rx="4" fill="#000" />
			<circle cx="15" cy="12" r="7" fill="#EB001B" />
			<circle cx="25" cy="12" r="7" fill="#FF5F00" />
		</svg>
	);
}

export function EloIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 40 24"
			fill="none"
			className="w-10 h-6"
			aria-label="Elo"
			role="img"
			{...props}
		>
			<title>Elo</title>
			<rect width="40" height="24" rx="4" fill="#FFCB05" />
			<text
				x="20"
				y="15"
				textAnchor="middle"
				fill="#000"
				fontSize="8"
				fontWeight="bold"
				fontFamily="Arial, sans-serif"
			>
				ELO
			</text>
		</svg>
	);
}

export function AmexIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 40 24"
			fill="none"
			className="w-10 h-6"
			aria-label="American Express"
			role="img"
			{...props}
		>
			<title>American Express</title>
			<rect width="40" height="24" rx="4" fill="#006FCF" />
			<text
				x="20"
				y="15"
				textAnchor="middle"
				fill="white"
				fontSize="6"
				fontWeight="bold"
				fontFamily="Arial, sans-serif"
			>
				AMEX
			</text>
		</svg>
	);
}

export function PixIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 40 24"
			fill="none"
			className="w-10 h-6"
			aria-label="PIX"
			role="img"
			{...props}
		>
			<title>PIX</title>
			<rect width="40" height="24" rx="4" fill="#32BCAD" />
			<text
				x="20"
				y="15"
				textAnchor="middle"
				fill="white"
				fontSize="8"
				fontWeight="bold"
				fontFamily="Arial, sans-serif"
			>
				PIX
			</text>
		</svg>
	);
}

export function BoletoIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 40 24"
			fill="none"
			className="w-10 h-6"
			aria-label="Boleto"
			role="img"
			{...props}
		>
			<title>Boleto</title>
			<rect width="40" height="24" rx="4" fill="#FF6B00" />
			<g transform="translate(8, 6)">
				<rect x="0" y="0" width="1.5" height="12" fill="white" />
				<rect x="3" y="0" width="1" height="12" fill="white" />
				<rect x="5.5" y="0" width="2" height="12" fill="white" />
				<rect x="9" y="0" width="1" height="12" fill="white" />
				<rect x="11.5" y="0" width="1.5" height="12" fill="white" />
				<rect x="14.5" y="0" width="1" height="12" fill="white" />
				<rect x="17" y="0" width="2" height="12" fill="white" />
				<rect x="20.5" y="0" width="1" height="12" fill="white" />
				<rect x="23" y="0" width="1.5" height="12" fill="white" />
			</g>
		</svg>
	);
}
