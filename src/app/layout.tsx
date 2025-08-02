import type { Metadata } from "next";
import { IBM_Plex_Mono, Libre_Baskerville, Lora } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { QueryProvider } from "./providers";

const libreBaskerville = Libre_Baskerville({
	weight: ["400", "700"],
	variable: "--font-sans",
	subsets: ["latin"],
});

const lora = Lora({
	variable: "--font-serif",
	subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
	weight: ["400", "500", "600"],
	variable: "--font-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Dr. Vista - Plataforma de Autenticação Segura",
	description:
		"Sistema administrativo moderno com autenticação segura e interface intuitiva para gestão completa",
	icons: {
		icon: "/drvista-favicon.svg",
		shortcut: "/drvista-favicon.svg",
		apple: "/drvista-favicon.svg",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={cn("min-h-screen bg-background antialiased")}>
				<QueryProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<QueryErrorResetBoundary>{children}</QueryErrorResetBoundary>
						<Toaster
							richColors
							position="bottom-right"
							expand={false}
							closeButton={true}
						/>
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
