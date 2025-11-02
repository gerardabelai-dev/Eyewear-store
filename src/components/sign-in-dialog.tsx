"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";

interface SignInDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	email: string;
	orderId: string;
}

export function SignInDialog({
	open,
	onOpenChange,
	email,
	orderId,
}: SignInDialogProps) {
	const router = useRouter();

	const handleSignIn = () => {
		const redirectUrl = `/checkout/${orderId}`;
		const searchParams = new URLSearchParams({
			redirect_to: redirectUrl,
			email: email,
		});
		router.push(`${ROUTES.SIGN_IN}?${searchParams.toString()}`);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Conta existente encontrada</DialogTitle>
					<DialogDescription>
						Já existe uma conta com o e-mail <strong>{email}</strong>. Deseja
						fazer login para continuar com a compra?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button onClick={handleSignIn}>Fazer login</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
