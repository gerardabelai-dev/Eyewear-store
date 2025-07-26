import type { Metadata } from "next";
import { IBM_Plex_Mono, Libre_Baskerville, Lora } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

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
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body
				className={`${libreBaskerville.variable} ${lora.variable} ${ibmPlexMono.variable} font-sans antialiased bg-background text-foreground`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster
						richColors
						position="bottom-right"
						expand={false}
						closeButton={true}
					/>
				</ThemeProvider>
			</body>
		</html>
	);
}
