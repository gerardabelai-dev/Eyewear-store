import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 flex items-center justify-center bg-background">
				<div className="w-full max-w-md mx-auto p-4">{children}</div>
			</main>
			<Footer />
		</div>
	);
}
