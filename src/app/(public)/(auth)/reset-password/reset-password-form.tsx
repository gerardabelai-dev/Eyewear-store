"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { resetPassword, signIn, useSession } from "@/lib/auth-client";

const resetPasswordSchema = z
	.object({
		email: z.email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(1),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
	const [token] = useQueryState("token", parseAsString);
	const [emailParam] = useQueryState("email", parseAsString);
	const session = useSession();
	const router = useRouter();

	const form = useForm<ResetPasswordValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: emailParam || session.data?.user.email || "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: ResetPasswordValues) => {
		console.log(values);

		if (!token) {
			toast.error("Token inválido");
			return;
		}

		try {
			// Reset password
			await resetPassword({
				newPassword: values.password,
				token: token,
			});

			// Auto sign-in after password setup
			const signInResult = await signIn.email({
				email: values.email,
				password: values.password,
			});

			if (signInResult.error) {
				console.error("Auto sign-in error:", signInResult.error);
				toast.error(
					"Senha configurada com sucesso! Por favor, faça login manualmente.",
				);
				router.push(ROUTES.SIGN_IN);
				return;
			}

			// Redirect to customer profile
			toast.success("Senha configurada com sucesso! Bem-vindo!");
			router.push(ROUTES.CUSTOMER_PROFILE);
		} catch (error) {
			console.error("Password reset error:", error);
			toast.error(
				"Erro ao configurar senha. Por favor, tente novamente ou entre em contato com o suporte.",
			);
		}
	};

	useEffect(() => {
		const emailToUse = emailParam || session.data?.user?.email;
		if (emailToUse) {
			form.setValue("email", emailToUse);
		}
	}, [emailParam, session, form]);

	return (
		<div className="w-full max-w-md mx-auto space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
					Configure sua Senha
				</h1>
				<p className="text-sm text-muted-foreground">
					Crie uma senha segura para acessar sua conta.
				</p>
			</div>

			<Card>
				<CardContent className="pt-6">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit, (errors) => {
								console.error("Form validation errors:", errors);
								toast.error(
									"Por favor, verifique os campos destacados e tente novamente.",
								);
							})}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											{session.isPending && !session.data ? (
												<Skeleton className="w-full h-10" />
											) : (
												<Input
													autoFocus
													placeholder="seu@email.com"
													type="email"
													autoComplete="email"
													{...field}
												/>
											)}
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Senha</FormLabel>
										<FormControl>
											<Input
												placeholder="Crie uma senha"
												type="password"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirmar senha</FormLabel>
										<FormControl>
											<Input
												placeholder="Confirme sua senha"
												type="password"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
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
										Configurando senha...
									</>
								) : (
									"Configurar senha e acessar conta"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
