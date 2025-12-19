import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth-server";

export const metadata: Metadata = {
	title: "ACME - Administração",
	description: "Sistema administrativo moderno para gestão completa",
};

export default async function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Only check authentication, don't fetch full profile here
	const user = await getCurrentUser();
	if (!user) {
		throw new Error("User not found");
	}
	const isAdmin = user.role === "admin";
	if (!isAdmin) {
		redirect(ROUTES.CUSTOMER_PROFILE);
	}

	return children;
}
