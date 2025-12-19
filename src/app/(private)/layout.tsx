import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ROUTES } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth-server";

// Force dynamic rendering for authenticated routes
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "ACME - Plataforma de Autenticação Segura",
	description:
		"Sistema administrativo moderno com autenticação segura e interface intuitiva para gestão completa",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Check authentication - redirect if not authenticated
	const user = await getCurrentUser();
	if (!user) {
		redirect(ROUTES.SIGN_IN);
	}

	return (
		<div className="min-dvh-screen flex flex-col">
			{/* Unified header - handles auth state automatically */}
			<Header />
			<main className="flex-1 space-y-6 p-2 sm:p-6">
				<div className="flex flex-col max-w-7xl p-2 sm:p-6 mx-auto gap-6 w-full">
					{children}
				</div>
			</main>
			<Footer />
		</div>
	);
}
