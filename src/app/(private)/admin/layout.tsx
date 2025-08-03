import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { ROUTES } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth-server";

export const metadata: Metadata = {
	title: "Dr. Vista - Administração",
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

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 space-y-6 p-6">
				<div className="flex flex-col max-w-7xl p-6 mx-auto gap-6 w-full">
					{children}
				</div>
			</main>
			<Footer />
		</div>
	);
}
