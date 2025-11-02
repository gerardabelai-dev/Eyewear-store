import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function AuthButtons() {
	return (
		<div className="flex items-center gap-2">
			<Button variant="ghost" asChild className="hidden md:flex">
				<Link href={ROUTES.SIGN_IN}>Entrar</Link>
			</Button>
			<Button asChild>
				<Link href={ROUTES.SIGN_UP}>Começar</Link>
			</Button>
		</div>
	);
}
