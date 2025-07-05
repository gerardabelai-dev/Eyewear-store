import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { getUserProfile } from "@/lib/actions/user";
import { getCurrentUser } from "@/lib/auth-server";

export const metadata: Metadata = {
	title: "DrVista Admin - Plataforma de Autenticação Segura",
	description:
		"Sistema administrativo moderno com autenticação segura e interface intuitiva para gestão completa",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getCurrentUser();
	if (!user) {
		redirect("/auth");
	}

	// Load user profile for header
	const userResult = await getUserProfile();
	if (userResult.error || !userResult.data) {
		redirect("/auth");
	}

	const userProfile = userResult.data;

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userInitials = getInitials(
		`${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() ||
			"User",
	);

	const userName =
		`${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() ||
		"Usuário";

	return (
		<main className="flex-1 space-y-6 p-6">
			<DashboardHeader
				userImage={userProfile.image}
				userInitials={userInitials}
				userName={userName}
				userEmail={userProfile.email}
			/>
			<div className="flex flex-col max-w-7xl p-6 mx-auto gap-6">
				{children}
			</div>
		</main>
	);
}
