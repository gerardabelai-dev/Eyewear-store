import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { UserHeaderSkeleton } from "@/components/user-header-skeleton";
import { ROUTES } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth-server";
import { PrivateHeaderNavigation } from "./header-navigation";

// Force dynamic rendering for authenticated routes
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Dr. Vista - Plataforma de Autenticação Segura",
	description:
		"Sistema administrativo moderno com autenticação segura e interface intuitiva para gestão completa",
};

async function PrivateHeaderWrapper() {
	const user = await getCurrentUser();
	if (!user) throw new Error("User not found");

	return <PrivateHeaderNavigation user={user} />;
}

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
		<div className="min-dvh-screen flex flex-col">
			{/* Stream header with user data */}
			<Suspense fallback={<UserHeaderSkeleton />}>
				<PrivateHeaderWrapper />
			</Suspense>
			<main className="flex-1 space-y-6 p-2 sm:p-6">
				<div className="flex flex-col max-w-7xl p-2 sm:p-6 mx-auto gap-6 w-full">
					{children}
				</div>
			</main>
			<Footer />
		</div>
	);
}
