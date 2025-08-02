import { IBM_Plex_Mono, Libre_Baskerville, Lora } from "next/font/google";

export const libreBaskerville = Libre_Baskerville({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-libre-baskerville",
});

export const lora = Lora({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-lora",
});

export const ibmPlexMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-ibm-plex-mono",
});

export const fontSans = libreBaskerville;
