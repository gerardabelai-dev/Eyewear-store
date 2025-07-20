"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { updateUserProfile } from "@/lib/actions/user";

const personalInfoSchema = z.object({
	firstName: z
		.string()
		.min(1, "Nome é obrigatório")
		.max(50, "Nome deve ter no máximo 50 caracteres"),
	lastName: z
		.string()
		.min(1, "Sobrenome é obrigatório")
		.max(50, "Sobrenome deve ter no máximo 50 caracteres"),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
	firstName?: string | null;
	lastName?: string | null;
}

export function PersonalInfoForm({
	firstName: initialFirstName,
	lastName: initialLastName,
}: PersonalInfoFormProps) {
	const [isPending, startTransition] = useTransition();

	const form = useForm<PersonalInfoFormData>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			firstName: initialFirstName || "",
			lastName: initialLastName || "",
		},
	});

	const onSubmit = (data: PersonalInfoFormData) => {
		startTransition(async () => {
			try {
				const result = await updateUserProfile({
					firstName: data.firstName || undefined,
					lastName: data.lastName || undefined,
				});

				if (result.error) {
					toast.error(result.error);
				} else if (result.success) {
					toast.success(result.success);
				}
			} catch (error) {
				toast.error("Erro ao atualizar informações pessoais");
				console.error("Erro ao atualizar perfil:", error);
			}
		});
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex justify-between items-start mb-6">
					<div>
						<h3 className="text-lg font-semibold mb-2">Informações Pessoais</h3>
						<p className="text-muted-foreground">
							Atualize seus dados pessoais.
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
						className="space-y-6"
					>
						<div className="space-y-6">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input
												placeholder="Digite seu primeiro nome"
												className="w-full"
												{...field}
											/>
										</FormControl>
										<div className="min-h-[20px]">
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>Sobrenome</FormLabel>
										<FormControl>
											<Input
												placeholder="Digite seu sobrenome"
												className="w-full"
												{...field}
											/>
										</FormControl>
										<div className="min-h-[20px]">
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end">
							<Button type="submit" disabled={isPending}>
								{isPending ? "Salvando..." : "Salvar Informações"}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
