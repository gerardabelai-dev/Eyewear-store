import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { AppLogo } from "./brand";

export function Header() {
	return (
		<header className="md:px-0 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-7xl mx-auto px-4 md:px-6">
				<div className="flex h-14 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="w-28">
						<AppLogo showText={true} />
					</Link>

					{/* Right side - Auth buttons */}
					<div className="flex items-center gap-4">
						<Link href={ROUTES.SIGN_IN} className="hidden md:block">
							<Button variant="ghost" size="sm">
								Entrar
							</Button>
						</Link>
						<Link href={ROUTES.SIGN_UP}>
							<Button size="sm" variant="vibrant">
								Começar
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}
