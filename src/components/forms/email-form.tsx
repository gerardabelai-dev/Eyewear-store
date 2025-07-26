"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useTransition } from "react";
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
import { updateUserEmail } from "@/lib/actions/user";

const emailSchema = z.object({
	email: z.string().email("Por favor, insira um email válido"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailFormProps {
	email: string;
}

export function EmailForm({ email: initialEmail }: EmailFormProps) {
	const [isPending, startTransition] = useTransition();

	const form = useForm<EmailFormData>({
		resolver: zodResolver(emailSchema),
		defaultValues: {
			email: initialEmail,
		},
	});

	const onSubmit = (data: EmailFormData) => {
		startTransition(async () => {
			try {
				const result = await updateUserEmail({ email: data.email });

				if (result.error) {
					toast.error(result.error);
				} else if (result.success) {
					toast.success(result.success);
				}
			} catch (error) {
				toast.error("Erro ao atualizar email");
				console.error("Erro ao atualizar email:", error);
			}
		});
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex justify-between items-start mb-6">
					<div>
						<h3 className="text-lg font-semibold mb-2">Endereço de Email</h3>
						<p className="text-sm text-muted-foreground">
							Atualize seu endereço de email principal para receber notificações
							e acessar sua conta.
						</p>
					</div>
				</div>

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
											type="email"
											placeholder="Digite seu email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end pt-2">
							<Button type="submit" disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Atualizando
									</>
								) : (
									"Atualizar Email"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
