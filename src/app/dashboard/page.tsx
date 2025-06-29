"use client";

import {
	Bell,
	CheckCircle,
	LogOut,
	Settings,
	Shield,
	User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { signOut, useSession } from "@/lib/auth-client";

export default function Dashboard() {
	const { data: session, isPending } = useSession();
	const router = useRouter();
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [marketingEmails, setMarketingEmails] = useState(false);

	useEffect(() => {
		if (!isPending && !session) {
			router.push("/auth");
		}
	}, [session, isPending, router]);

	const handleSignOut = async () => {
		try {
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push("/auth");
					},
				},
			});
		} catch (error) {
			console.error("Sign out error:", error);
		}
	};

	if (isPending) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="flex flex-col items-center space-y-4">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
					<p className="text-muted-foreground">Carregando seu dashboard...</p>
				</div>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-4">
							<Settings className="w-6 h-6" />
							<h1 className="text-xl font-semibold">Configurações</h1>
						</div>
						<Button variant="outline" onClick={handleSignOut} size="sm">
							<LogOut className="w-4 h-4 mr-2" />
							Sair
						</Button>
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="space-y-6">
					<div>
						<h2 className="text-2xl font-bold tracking-tight">
							Configurações da Conta
						</h2>
						<p className="text-muted-foreground">
							Gerencie as configurações e preferências da sua conta.
						</p>
					</div>

					{/* Account Status Alert */}
					<Alert>
						<CheckCircle className="h-4 w-4" />
						<AlertDescription>
							Sua conta está verificada e segura.{" "}
							<Badge variant="secondary" className="ml-2">
								Ativo
							</Badge>
						</AlertDescription>
					</Alert>

					{/* Profile Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<User className="w-5 h-5" />
								<span>Perfil</span>
							</CardTitle>
							<CardDescription>
								É assim que outros vão te ver no site.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center space-x-4">
								{session.user.image ? (
									<Image
										src={session.user.image}
										alt="Perfil"
										width={80}
										height={80}
										className="w-20 h-20 rounded-full border"
									/>
								) : (
									<div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
										<User className="w-8 h-8 text-muted-foreground" />
									</div>
								)}
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<p className="text-sm font-medium leading-none">
											{session.user.name || "Nome não definido"}
										</p>
										{session.user.emailVerified && (
											<Badge variant="outline" className="text-green-600">
												Verificado
											</Badge>
										)}
									</div>
									<p className="text-sm text-muted-foreground">
										{session.user.email}
									</p>
									<Button variant="outline" size="sm" className="mt-2">
										Alterar foto
									</Button>
								</div>
							</div>

							<Separator />

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label htmlFor="fullName">Nome Completo</Label>
									<Input
										id="fullName"
										value={session.user.name || "Não definido"}
										disabled
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" value={session.user.email} disabled />
								</div>
								<div className="space-y-2">
									<Label htmlFor="userId">ID do Usuário</Label>
									<Input
										id="userId"
										value={session.user.id}
										disabled
										className="font-mono text-sm"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="memberSince">Membro desde</Label>
									<Input
										id="memberSince"
										value={new Date(session.user.createdAt).toLocaleDateString(
											"pt-BR",
											{
												year: "numeric",
												month: "long",
												day: "numeric",
											},
										)}
										disabled
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Security Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Shield className="w-5 h-5" />
								<span>Segurança</span>
							</CardTitle>
							<CardDescription>
								Gerencie suas configurações e preferências de segurança.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div className="space-y-1">
									<p className="text-sm font-medium">Senha</p>
									<p className="text-sm text-muted-foreground">
										Última atualização na criação da conta
									</p>
								</div>
								<Button variant="outline" size="sm">
									Alterar senha
								</Button>
							</div>

							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div className="space-y-1">
									<div className="flex items-center space-x-2">
										<p className="text-sm font-medium">
											Autenticação de dois fatores
										</p>
										<Badge variant="outline" className="text-orange-600">
											Recomendado
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										Adicione uma camada extra de segurança à sua conta
									</p>
								</div>
								<Button variant="outline" size="sm">
									Ativar 2FA
								</Button>
							</div>

							{session.user.createdAt && (
								<div className="flex items-center space-x-2 text-green-600 dark:text-green-400 p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
									<Shield className="w-4 h-4" />
									<span className="text-sm font-medium">
										Conta criada em{" "}
										{session.user.createdAt.toLocaleDateString("pt-BR", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</span>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Preferences Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Bell className="w-5 h-5" />
								<span>Preferências</span>
							</CardTitle>
							<CardDescription>
								Configure como você recebe notificações e atualizações.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<Label
										htmlFor="email-notifications"
										className="text-sm font-medium"
									>
										Notificações por email
									</Label>
									<p className="text-sm text-muted-foreground">
										Receba emails sobre a atividade da sua conta
									</p>
								</div>
								<Switch
									id="email-notifications"
									checked={emailNotifications}
									onCheckedChange={setEmailNotifications}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<Label
										htmlFor="marketing-emails"
										className="text-sm font-medium"
									>
										Emails de marketing
									</Label>
									<p className="text-sm text-muted-foreground">
										Receba emails sobre novos recursos e atualizações
									</p>
								</div>
								<Switch
									id="marketing-emails"
									checked={marketingEmails}
									onCheckedChange={setMarketingEmails}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<Label className="text-sm font-medium">
										Notificações push
									</Label>
									<p className="text-sm text-muted-foreground">
										Receba notificações push nos seus dispositivos
									</p>
								</div>
								<Badge variant="secondary">Em breve</Badge>
							</div>
						</CardContent>
					</Card>

					{/* Danger Zone */}
					<Card className="border-red-200 dark:border-red-800">
						<CardHeader>
							<CardTitle className="text-red-600 dark:text-red-400">
								Zona de Perigo
							</CardTitle>
							<CardDescription>
								Ações irreversíveis e destrutivas
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
								<div className="space-y-1">
									<p className="text-sm font-medium">Excluir conta</p>
									<p className="text-sm text-muted-foreground">
										Exclua permanentemente sua conta e todos os dados associados
									</p>
								</div>
								<Button
									variant="outline"
									size="sm"
									className="text-red-600 border-red-200 hover:bg-red-50"
								>
									Excluir conta
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
