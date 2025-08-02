import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { UserHeaderSkeleton } from "@/components/user-header-skeleton";
import { UserHeaderWrapper } from "@/components/user-header-wrapper";
import { ROUTES } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth-server";

// Remove force-dynamic to allow caching of auth check
// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Dr. Vista - Plataforma de Autenticação Segura",
	description:
		"Sistema administrativo moderno com autenticação segura e interface intuitiva para gestão completa",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Only check authentication, don't fetch full profile here
	const user = await getCurrentUser();
	if (!user) {
		redirect(ROUTES.SIGN_IN);
	}

	return (
		<div className="min-h-screen flex flex-col">
			{/* Stream header with user data */}
			<Suspense fallback={<UserHeaderSkeleton />}>
				<UserHeaderWrapper />
			</Suspense>
			<main className="flex-1 space-y-6 p-6">
				<div className="flex flex-col max-w-7xl p-6 mx-auto gap-6 w-full">
					{children}
				</div>
			</main>
			<Footer />
		</div>
	);
}
