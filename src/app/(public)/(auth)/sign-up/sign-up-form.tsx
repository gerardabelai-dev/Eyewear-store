"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { ROUTES } from "@/constants/routes";
import { signIn, signUp } from "@/lib/auth-client";

const signUpSchema = z
	.object({
		name: z.string().min(2),
		email: z.email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(1),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type SignUpValues = z.infer<typeof signUpSchema>;

function SignUp() {
	const router = useRouter();

	const form = useForm<SignUpValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: SignUpValues) => {
		await signUp.email(
			{
				email: values.email,
				password: values.password,
				name: values.name,
			},
			{
				onSuccess: () => {
					router.push(ROUTES.CUSTOMER_PROFILE);
				},
				onError: (ctx) => {
					const message = ctx.error.message || "Falha ao criar conta";
					toast.error(message);
				},
			},
		);
	};

	const handleGoogleSignUp = async () => {
		await signIn.social(
			{
				provider: "google",
				callbackURL: ROUTES.CUSTOMER_PROFILE,
			},
			{
				onError: (ctx) => {
					const message =
						ctx.error.message || "Falha ao criar conta com Google";
					toast.error(message);
				},
			},
		);
	};

	return (
		<div className="w-full max-w-md mx-auto space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
					Criar uma conta
				</h1>
				<p className="text-sm text-muted-foreground">
					Digite suas informações para começar
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
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome completo</FormLabel>
										<FormControl>
											<Input
												placeholder="João Silva"
												className="w-full"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="seu@email.com"
												type="email"
												autoComplete="email"
												{...field}
											/>
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
										Criando conta...
									</>
								) : (
									"Criar conta"
								)}
							</Button>
						</form>
					</Form>

					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Ou continue com
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						className="w-full"
						onClick={handleGoogleSignUp}
						disabled={form.formState.isSubmitting}
					>
						<svg
							className="mr-2 h-4 w-4"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continuar com Google
					</Button>
				</CardContent>
			</Card>

			<div className="text-center mt-4">
				<p className="text-sm text-muted-foreground">
					Já tem uma conta?{" "}
					<Link href={ROUTES.SIGN_IN} className="text-primary hover:underline">
						Fazer login
					</Link>
				</p>
			</div>
		</div>
	);
}

SignUp.displayName = "SignUp";
export default SignUp;
