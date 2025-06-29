"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changeUserPassword, setUserPassword } from "@/lib/actions/user";

// Schema for changing password (when user already has one)
const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Senha atual é obrigatória"),
		newPassword: z
			.string()
			.min(8, "Nova senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Senhas não coincidem",
		path: ["confirmPassword"],
	});

// Schema for setting password (for OAuth users)
const setPasswordSchema = z
	.object({
		newPassword: z
			.string()
			.min(8, "Nova senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Senhas não coincidem",
		path: ["confirmPassword"],
	});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

interface PasswordFormProps {
	hasPassword: boolean;
}

export function PasswordForm({ hasPassword }: PasswordFormProps) {
	const [isPending, startTransition] = useTransition();

	// Use different forms based on whether user has password
	const changePasswordForm = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const setPasswordForm = useForm<SetPasswordFormData>({
		resolver: zodResolver(setPasswordSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onChangePasswordSubmit = async (data: ChangePasswordFormData) => {
		startTransition(async () => {
			const result = await changeUserPassword(data);

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(result.success);
				changePasswordForm.reset();
			}
		});
	};

	const onSetPasswordSubmit = async (data: SetPasswordFormData) => {
		startTransition(async () => {
			const formData = new FormData();
			formData.append("newPassword", data.newPassword);
			formData.append("confirmPassword", data.confirmPassword);

			const result = await setUserPassword(formData);

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(result.success);
				setPasswordForm.reset();
				// Refresh the page to update the hasPassword status
				window.location.reload();
			}
		});
	};

	if (hasPassword) {
		// User has password - show change password form
		return (
			<Card className="p-6">
				<h3 className="text-lg font-medium mb-4">Alterar Senha</h3>

				<Form {...changePasswordForm}>
					<form
						onSubmit={changePasswordForm.handleSubmit(onChangePasswordSubmit)}
						className="space-y-4"
					>
						<FormField
							control={changePasswordForm.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Senha Atual</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<div className="min-h-[20px]">
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={changePasswordForm.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Nova Senha</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<div className="min-h-[20px]">
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={changePasswordForm.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Confirmar Nova Senha</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<div className="min-h-[20px]">
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isPending}>
							{isPending ? "Alterando..." : "Alterar Senha"}
						</Button>
					</form>
				</Form>
			</Card>
		);
	}

	// User doesn't have password - show set password form
	return (
		<Card className="p-6">
			<div className="mb-4">
				<h3 className="text-lg font-medium">Definir Senha</h3>
				<p className="text-sm text-muted-foreground mt-1">
					Você entrou usando o Google. Defina uma senha para poder fazer login
					também com email e senha.
				</p>
			</div>

			<Form {...setPasswordForm}>
				<form
					onSubmit={setPasswordForm.handleSubmit(onSetPasswordSubmit)}
					className="space-y-4"
				>
					<FormField
						control={setPasswordForm.control}
						name="newPassword"
						render={({ field }) => (
							<FormItem className="space-y-2">
								<FormLabel>Nova Senha</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<div className="min-h-[20px]">
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={setPasswordForm.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem className="space-y-2">
								<FormLabel>Confirmar Senha</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<div className="min-h-[20px]">
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isPending}>
						{isPending ? "Definindo..." : "Definir Senha"}
					</Button>
				</form>
			</Form>
		</Card>
	);
}
