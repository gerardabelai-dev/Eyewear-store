import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { AppLogo } from "./brand";

export function Header() {
	return (
		<header className="border-b bg-background/80 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-14 sm:h-16">
					<Link href="/" className="hover:opacity-80 transition-opacity">
						<AppLogo showText={true} />
					</Link>
					<nav className="flex items-center space-x-2 sm:space-x-4">
						<Link href={ROUTES.SIGN_IN}>
							<Button
								variant="ghost"
								size="sm"
								className="hidden sm:inline-flex"
							>
								Entrar
							</Button>
						</Link>
						<Link href={ROUTES.SIGN_UP}>
							<Button
								size="sm"
								variant="vibrant"
								className="text-sm px-3 sm:px-4"
							>
								Começar
							</Button>
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
}
