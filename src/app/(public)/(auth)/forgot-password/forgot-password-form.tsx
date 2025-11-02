"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { forgetPassword } from "@/lib/auth-client";

const forgotPasswordSchema = z.object({
	email: z.string().email("Por favor, insira um endereço de email válido"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
	const [emailSent, setEmailSent] = useState(false);

	const form = useForm<ForgotPasswordValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (values: ForgotPasswordValues) => {
		try {
			await forgetPassword({
				email: values.email,
				redirectTo: ROUTES.CUSTOMER_PROFILE,
			});

			setEmailSent(true);
			toast.success("Email enviado! Verifique sua caixa de entrada.");
		} catch (error) {
			console.error("Forgot password error:", error);
			toast.error(
				"Erro ao enviar email. Por favor, verifique o endereço e tente novamente.",
			);
		}
	};

	if (emailSent) {
		return (
			<div className="w-full max-w-md mx-auto space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Email enviado!
					</h1>
					<p className="text-sm text-muted-foreground">
						Verifique sua caixa de entrada e clique no link para redefinir sua
						senha.
					</p>
				</div>

				<Card>
					<CardContent className="pt-6">
						<div className="space-y-4">
							<div className="rounded-lg bg-muted p-4 text-sm">
								<p className="font-medium mb-2">Próximos passos:</p>
								<ol className="list-decimal list-inside space-y-1 text-muted-foreground">
									<li>Verifique sua caixa de entrada de email</li>
									<li>Clique no link de redefinição de senha</li>
									<li>Crie uma nova senha</li>
								</ol>
							</div>

							<p className="text-xs text-muted-foreground text-center">
								Não recebeu o email? Verifique sua pasta de spam ou tente enviar
								novamente.
							</p>

							<Button
								variant="outline"
								className="w-full"
								onClick={() => setEmailSent(false)}
							>
								Enviar novamente
							</Button>
						</div>
					</CardContent>
				</Card>

				<Button variant="link" asChild className="w-full">
					<Link href={ROUTES.SIGN_IN}>Voltar para login</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="w-full max-w-md mx-auto space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
					Esqueceu sua senha?
				</h1>
				<p className="text-sm text-muted-foreground">
					Digite seu email e enviaremos um link para redefinir sua senha
				</p>
			</div>

			<Card>
				<CardContent className="pt-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												autoFocus
												placeholder="seu@email.com"
												type="email"
												autoComplete="email"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Enviaremos um link de redefinição de senha para este email
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="w-full"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Enviando...
									</>
								) : (
									"Enviar link de redefinição"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			<div className="text-center">
				<p className="text-sm text-muted-foreground">
					Lembrou sua senha?{" "}
					<Link href={ROUTES.SIGN_IN} className="text-primary hover:underline">
						Fazer login
					</Link>
				</p>
			</div>
		</div>
	);
}
