"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { use, useEffect } from "react";
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
import {
	requestPasswordReset,
	resetPassword,
	useSession,
} from "@/lib/auth-client";

const resetPasswordSchema = z
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

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
	const [token] = useQueryState("token", parseAsString);
	const session = useSession();
	const router = useRouter();

	const form = useForm<ResetPasswordValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			name: session.data?.user.name || "",
			email: session.data?.user.email || "",
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

		await resetPassword({
			newPassword: values.password,
			token: token,
		});

		router.push(ROUTES.SIGN_IN);
	};

	const onSubmitRequestPassword = async (values: ResetPasswordValues) => {
		console.log(values);
		await requestPasswordReset({
			email: values.email,
			redirectTo: ROUTES.HOME,
		});
	};

	useEffect(() => {
		if (session.data?.user) {
			if (session.data.user.email) {
				form.setValue("email", session.data.user.email);
			}
			if (session.data.user.name) {
				form.setValue("name", session.data.user.name);
			}
		}
	}, [session]);

	return (
		<div className="w-full max-w-md mx-auto space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">Resetar Senha</h1>
				<p className="text-sm text-muted-foreground">
					Digite sua nova senha e confirme-a.
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
											{session.isPending && !session.data ? (
												<Skeleton className="w-full h-10" />
											) : (
												<Input
													disabled
													placeholder="João Silva"
													className="w-full"
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
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											{session.isPending && !session.data ? (
												<Skeleton className="w-full h-10" />
											) : (
												<Input
													disabled
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
												autoFocus
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
								type="button"
								className="w-full"
								variant="secondary"
								onClick={() => {
									onSubmitRequestPassword(form.getValues());
								}}
							>
								Solicitar Resetar Senha
							</Button>
							<Button
								type="submit"
								className="w-full"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Resetando senha...
									</>
								) : (
									"Resetar senha"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
