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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";

// Create a global toast tracker to prevent duplicates across all sign-in attempts
const globalToastTracker = {
	lastToast: "",
	lastToastTime: 0,

	canShowToast(message: string): boolean {
		const now = Date.now();
		const timeDiff = now - this.lastToastTime;

		// Prevent same message within 2 seconds
		if (this.lastToast === message && timeDiff < 2000) {
			return false;
		}

		this.lastToast = message;
		this.lastToastTime = now;
		return true;
	},
};

const signInSchema = z.object({
	email: z
		.string()
		.min(1, "Email é obrigatório")
		.email("Por favor, insira um endereço de email válido"),
	password: z
		.string()
		.min(1, "Senha é obrigatória")
		.min(8, "A senha deve ter pelo menos 8 caracteres"),
	rememberMe: z.boolean(),
});

type SignInValues = z.infer<typeof signInSchema>;

function SignIn() {
	const router = useRouter();
	const form = useForm<SignInValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const onSubmit = async (values: SignInValues) => {
		try {
			await signIn.email(
				{
					email: values.email,
					password: values.password,
				},
				{
					onSuccess: () => {
						const message = "Bem-vindo de volta!";
						if (globalToastTracker.canShowToast(message)) {
							toast.success(message);
							router.push("/");
						}
					},
					onError: (ctx) => {
						const message = ctx.error.message || "Falha ao fazer login";
						if (globalToastTracker.canShowToast(message)) {
							toast.error(message);
						}
					},
				},
			);
		} catch (_errorrr) {
			const message = "Ocorreu um erro inesperado";
			if (globalToastTracker.canShowToast(message)) {
				toast.error(message);
			}
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			await signIn.social(
				{
					provider: "google",
					callbackURL: "/",
				},
				{
					onSuccess: () => {
						const message = "Bem-vindo de volta!";
						if (globalToastTracker.canShowToast(message)) {
							toast.success(message);
						}
					},
					onError: (ctx) => {
						const message =
							ctx.error.message || "Falha ao fazer login com Google";
						if (globalToastTracker.canShowToast(message)) {
							toast.error(message);
						}
					},
				},
			);
		} catch (_errorrr) {
			const message = "Ocorreu um erro inesperado";
			if (globalToastTracker.canShowToast(message)) {
				toast.error(message);
			}
		}
	};

	return (
		<div className="w-full max-w-md mx-auto space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
					Bem-vindo de volta
				</h1>
				<p className="text-sm text-muted-foreground">
					Digite seu email para acessar sua conta
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
										<div className="flex items-center justify-between">
											<FormLabel>Senha</FormLabel>
											<button
												type="button"
												className="text-sm text-muted-foreground hover:text-primary cursor-pointer underline bg-transparent border-none p-0"
												onClick={() => {
													// TODO: Implement forgot password functionality
													console.log("Forgot password clicked");
												}}
											>
												Esqueceu a senha?
											</button>
										</div>
										<FormControl>
											<Input
												placeholder="Digite sua senha"
												type="password"
												autoComplete="current-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="rememberMe"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel className="text-sm font-normal">
												Lembrar de mim
											</FormLabel>
										</div>
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
										Entrando...
									</>
								) : (
									"Entrar"
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
						onClick={handleGoogleSignIn}
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
					Não tem uma conta?{" "}
					<Link href="/auth/sign-up" className="text-primary hover:underline">
						Criar conta
					</Link>
				</p>
			</div>
		</div>
	);
}

SignIn.displayName = "SignIn";
export default SignIn;
