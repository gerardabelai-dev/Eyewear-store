import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { AppLogo } from "./brand";

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-7xl mx-auto">
				<div className="flex h-14 items-center justify-between">
					{/* Logo */}
					<div className="flex items-center space-x-4 sm:space-x-8">
						<Link href="/" className="flex items-center space-x-2">
							<AppLogo showText={true} />
						</Link>
					</div>

					{/* Right side - Auth buttons */}
					<div className="flex items-center space-x-2 sm:space-x-4">
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
					</div>
				</div>
			</div>
		</header>
	);
}
