"use client";

import {
	Bell,
	CreditCard,
	FileText,
	LogOut,
	Search,
	Settings,
	Shield,
	Upload,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
	changeUserPassword,
	getUserProfile,
	updateUserEmail,
	updateUserProfile,
} from "@/lib/actions/user";
import { signOut, useSession } from "@/lib/auth-client";

interface UserProfile {
	id: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	image?: string | null;
	emailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export default function Dashboard() {
	const { data: session, isPending } = useSession();
	const router = useRouter();
	const [isPendingTransition, startTransition] = useTransition();
	const [activeSection, setActiveSection] = useState("account");

	// User profile state
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [isLoadingProfile, setIsLoadingProfile] = useState(true);

	// Form states
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [dataExportAccess, setDataExportAccess] = useState(false);
	const [allowAdminAddMembers, setAllowAdminAddMembers] = useState(false);
	const [enableTwoFactor, setEnableTwoFactor] = useState(false);

	// Load user profile data
	const loadUserProfile = useCallback(async () => {
		try {
			setIsLoadingProfile(true);
			const result = await getUserProfile();

			if (result.error) {
				toast.error(result.error);
				return;
			}

			if (result.data) {
				setUserProfile(result.data);
				// Update form states with real data
				setFirstName(result.data.firstName || "");
				setLastName(result.data.lastName || "");
				setEmail(result.data.email);
			}
		} catch (error) {
			console.error("Erro ao carregar perfil:", error);
			toast.error("Erro ao carregar dados do perfil");
		} finally {
			setIsLoadingProfile(false);
		}
	}, []);

	useEffect(() => {
		if (session?.user) {
			loadUserProfile();
		}
	}, [session, loadUserProfile]);

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

	const handleUpdateProfile = async () => {
		startTransition(async () => {
			try {
				const result = await updateUserProfile({
					firstName: firstName || undefined,
					lastName: lastName || undefined,
				});

				if (result.error) {
					toast.error(result.error);
				} else if (result.success) {
					toast.success(result.success);
					loadUserProfile(); // Reload profile data
				}
			} catch (error) {
				toast.error("Erro ao atualizar perfil");
				console.error("Erro ao atualizar perfil:", error);
			}
		});
	};

	const handleUpdateEmail = async () => {
		startTransition(async () => {
			try {
				const result = await updateUserEmail({ email });

				if (result.error) {
					toast.error(result.error);
				} else if (result.success) {
					toast.success(result.success);
					loadUserProfile(); // Reload profile data
				}
			} catch (error) {
				toast.error("Erro ao atualizar email");
				console.error("Erro ao atualizar email:", error);
			}
		});
	};

	const handleChangePassword = async () => {
		startTransition(async () => {
			try {
				const result = await changeUserPassword({
					currentPassword,
					newPassword,
					confirmPassword,
				});

				if (result.error) {
					toast.error(result.error);
				} else if (result.success) {
					toast.success(result.success);
					// Clear password fields on success
					setCurrentPassword("");
					setNewPassword("");
					setConfirmPassword("");
				}
			} catch (error) {
				toast.error("Erro ao alterar senha");
				console.error("Erro ao alterar senha:", error);
			}
		});
	};

	if (isPending || isLoadingProfile) {
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

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userInitials = getInitials(
		`${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim() ||
			"User",
	);

	const sidebarItems = [
		{ id: "account", label: "Conta", icon: Settings },
		{ id: "members", label: "Membros", icon: Users },
		{ id: "billing", label: "Cobrança", icon: CreditCard },
		{ id: "invoices", label: "Faturas", icon: FileText },
		{ id: "notifications", label: "Notificações", icon: Bell },
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Header Navigation */}
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-8">
							<div className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
									<Shield className="w-5 h-5 text-white" />
								</div>
								<span className="text-xl font-bold">DrVista Admin</span>
							</div>
							<nav className="hidden md:flex items-center space-x-6">
								<Button variant="ghost" className="text-muted-foreground">
									Dashboard
								</Button>
								<Button variant="ghost" className="text-muted-foreground">
									Pedidos
								</Button>
								<Button variant="ghost" className="text-muted-foreground">
									Produtos
								</Button>
								<Button variant="ghost" className="text-muted-foreground">
									Clientes
								</Button>
								<Button variant="outline" className="bg-muted text-foreground">
									Configurações
								</Button>
							</nav>
						</div>
						<div className="flex items-center space-x-4">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
									>
										<div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
											<span className="text-white text-sm font-semibold">
												{userInitials}
											</span>
										</div>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end">
									<DropdownMenuLabel>
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium">
												{`${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim() ||
													"Usuário"}
											</p>
											<p className="text-xs text-muted-foreground">
												{userProfile?.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => setActiveSection("account")}>
										<Settings className="mr-2 h-4 w-4" />
										Configurações
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										variant="destructive"
										onClick={handleSignOut}
									>
										<LogOut className="mr-2 h-4 w-4" />
										Sair
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">Configurações</h1>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
						<Input placeholder="Buscar" className="pl-10 w-64" />
					</div>
				</div>

				<div className="flex gap-8">
					{/* Sidebar */}
					<div className="w-64 space-y-2">
						{sidebarItems.map((item) => {
							const Icon = item.icon;
							return (
								<Button
									key={item.id}
									variant={activeSection === item.id ? "outline" : "ghost"}
									className="w-full justify-start"
									onClick={() => setActiveSection(item.id)}
								>
									<Icon className="w-4 h-4 mr-3" />
									{item.label}
								</Button>
							);
						})}
					</div>

					{/* Main Content */}
					<div className="flex-1 space-y-6">
						{activeSection === "account" && (
							<>
								{/* Avatar Section */}
								<Card>
									<CardContent className="pt-6">
										<div className="flex justify-between items-start">
											<div>
												<h3 className="text-lg font-semibold mb-2">Avatar</h3>
												<p className="text-muted-foreground mb-6">
													O avatar é sua foto de perfil - todos que visitarem
													seu perfil verão isso.
												</p>
												<div className="flex items-center space-x-4">
													<div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
														<span className="text-white text-lg font-semibold">
															{userInitials}
														</span>
													</div>
													<Button variant="outline" size="sm">
														<Upload className="w-4 h-4 mr-2" />
														Enviar
													</Button>
												</div>
											</div>
											<Button>Salvar</Button>
										</div>
									</CardContent>
								</Card>

								{/* Profile Information */}
								<Card>
									<CardContent className="pt-6">
										<div className="flex justify-between items-start">
											<div className="flex-1 max-w-md">
												<h3 className="text-lg font-semibold mb-2">
													Informações do Perfil
												</h3>
												<p className="text-muted-foreground mb-4">
													Visualize suas informações básicas de perfil.
												</p>
												<div className="space-y-2">
													<div>
														<Label className="text-sm font-medium">
															Nome Completo
														</Label>
														<p className="text-sm text-muted-foreground">
															{`${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim() ||
																"Não informado"}
														</p>
													</div>
													<div>
														<Label className="text-sm font-medium">Email</Label>
														<p className="text-sm text-muted-foreground">
															{userProfile?.email}
														</p>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Basic Information */}
								<Card>
									<CardContent className="pt-6">
										<div className="flex justify-between items-start mb-6">
											<div>
												<h3 className="text-lg font-semibold mb-2">
													Editar Informações
												</h3>
												<p className="text-muted-foreground">
													Atualize seus dados pessoais e informações da conta.
												</p>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4 max-w-2xl">
											<div>
												<Label htmlFor="firstName">Nome</Label>
												<Input
													id="firstName"
													value={firstName}
													onChange={(e) => setFirstName(e.target.value)}
													placeholder="Digite seu primeiro nome"
												/>
											</div>
											<div>
												<Label htmlFor="lastName">Sobrenome</Label>
												<Input
													id="lastName"
													value={lastName}
													onChange={(e) => setLastName(e.target.value)}
													placeholder="Digite seu sobrenome"
												/>
											</div>
											<div className="col-span-2">
												<Label htmlFor="email">Endereço de email</Label>
												<Input
													id="email"
													type="email"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													placeholder="Digite seu email"
												/>
											</div>
										</div>

										<div className="flex justify-end mt-6 space-x-2">
											<Button
												variant="outline"
												onClick={handleUpdateEmail}
												disabled={isPendingTransition}
											>
												{isPendingTransition
													? "Atualizando..."
													: "Atualizar Email"}
											</Button>
											<Button
												onClick={handleUpdateProfile}
												disabled={isPendingTransition}
											>
												{isPendingTransition
													? "Salvando..."
													: "Salvar Informações"}
											</Button>
										</div>
									</CardContent>
								</Card>

								{/* Change Password */}
								<Card>
									<CardContent className="pt-6">
										<div className="flex justify-between items-start mb-6">
											<div>
												<h3 className="text-lg font-semibold mb-2">
													Alterar senha
												</h3>
												<p className="text-muted-foreground">
													Atualize sua senha para manter sua conta segura.
												</p>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4 max-w-2xl">
											<div>
												<Label htmlFor="currentPassword">
													Verificar senha atual
												</Label>
												<Input
													id="currentPassword"
													type="password"
													value={currentPassword}
													onChange={(e) => setCurrentPassword(e.target.value)}
													placeholder="••••••••"
												/>
											</div>
											<div></div>
											<div>
												<Label htmlFor="newPassword">Nova senha</Label>
												<Input
													id="newPassword"
													type="password"
													value={newPassword}
													onChange={(e) => setNewPassword(e.target.value)}
													placeholder="••••••••"
												/>
											</div>
											<div>
												<Label htmlFor="confirmPassword">Confirmar senha</Label>
												<Input
													id="confirmPassword"
													type="password"
													value={confirmPassword}
													onChange={(e) => setConfirmPassword(e.target.value)}
													placeholder="••••••••"
												/>
											</div>
										</div>

										<div className="flex justify-end mt-6">
											<Button
												onClick={handleChangePassword}
												disabled={isPendingTransition}
											>
												{isPendingTransition ? "Alterando..." : "Salvar"}
											</Button>
										</div>
									</CardContent>
								</Card>

								{/* Advanced Settings */}
								<Card>
									<CardContent className="pt-6">
										<div className="flex justify-between items-start mb-6">
											<div>
												<h3 className="text-lg font-semibold mb-2">
													Configurações avançadas
												</h3>
												<p className="text-muted-foreground">
													Configure preferências detalhadas da conta e opções de
													segurança.
												</p>
											</div>
										</div>

										<div className="space-y-6">
											<div className="flex items-start space-x-3">
												<Checkbox
													id="dataExport"
													checked={dataExportAccess}
													onChange={(e) =>
														setDataExportAccess(e.target.checked)
													}
													className="mt-1"
												/>
												<div className="space-y-1">
													<Label htmlFor="dataExport" className="font-medium">
														Acesso à Exportação de Dados
													</Label>
													<p className="text-sm text-muted-foreground">
														Permitir exportação de dados pessoais e backups.
													</p>
												</div>
											</div>

											<div className="flex items-start space-x-3">
												<Checkbox
													id="allowAdmin"
													checked={allowAdminAddMembers}
													onChange={(e) =>
														setAllowAdminAddMembers(e.target.checked)
													}
													className="mt-1"
												/>
												<div className="space-y-1">
													<Label htmlFor="allowAdmin" className="font-medium">
														Permitir que Admins Adicionem Membros
													</Label>
													<p className="text-sm text-muted-foreground">
														Admins podem convidar e gerenciar membros.
													</p>
												</div>
											</div>

											<div className="flex items-start space-x-3">
												<Checkbox
													id="enableTwoFactor"
													checked={enableTwoFactor}
													onChange={(e) => setEnableTwoFactor(e.target.checked)}
													className="mt-1"
												/>
												<div className="space-y-1">
													<Label
														htmlFor="enableTwoFactor"
														className="font-medium"
													>
														Ativar Autenticação de Dois Fatores
													</Label>
													<p className="text-sm text-muted-foreground">
														Exigir 2FA para maior segurança da conta.
													</p>
												</div>
											</div>
										</div>

										<div className="flex justify-end mt-6">
											<Button>Salvar</Button>
										</div>
									</CardContent>
								</Card>

								{/* Delete Account */}
								<Card className="border-red-200 dark:border-red-800">
									<CardContent className="pt-6">
										<h3 className="text-lg font-semibold mb-2 text-red-600">
											Excluir conta
										</h3>
										<p className="text-muted-foreground mb-4">
											Isso excluirá permanentemente sua Conta Pessoal. Por
											favor, note que esta ação é irreversível, então proceda
											com cautela.
										</p>
										<p className="text-red-600 text-sm mb-4 font-medium">
											Esta ação não pode ser desfeita!
										</p>
										<Button variant="destructive">Excluir conta</Button>
									</CardContent>
								</Card>
							</>
						)}

						{activeSection === "members" && (
							<Card>
								<CardContent className="pt-6">
									<h3 className="text-lg font-semibold mb-2">
										Gerenciar Membros
									</h3>
									<p className="text-muted-foreground mb-6">
										Convide e gerencie membros da sua equipe.
									</p>
									<div className="text-center py-12 text-muted-foreground">
										<Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
										<p>Funcionalidade de membros em desenvolvimento</p>
									</div>
								</CardContent>
							</Card>
						)}

						{activeSection === "billing" && (
							<Card>
								<CardContent className="pt-6">
									<h3 className="text-lg font-semibold mb-2">
										Cobrança e Planos
									</h3>
									<p className="text-muted-foreground mb-6">
										Gerencie sua assinatura e métodos de pagamento.
									</p>
									<div className="text-center py-12 text-muted-foreground">
										<CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
										<p>Funcionalidade de cobrança em desenvolvimento</p>
									</div>
								</CardContent>
							</Card>
						)}

						{activeSection === "invoices" && (
							<Card>
								<CardContent className="pt-6">
									<h3 className="text-lg font-semibold mb-2">Faturas</h3>
									<p className="text-muted-foreground mb-6">
										Visualize e baixe suas faturas.
									</p>
									<div className="text-center py-12 text-muted-foreground">
										<FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
										<p>Nenhuma fatura encontrada</p>
									</div>
								</CardContent>
							</Card>
						)}

						{activeSection === "notifications" && (
							<Card>
								<CardContent className="pt-6">
									<h3 className="text-lg font-semibold mb-2">
										Preferências de Notificação
									</h3>
									<p className="text-muted-foreground mb-6">
										Configure como você recebe notificações.
									</p>
									<div className="space-y-6">
										<div className="flex items-center justify-between">
											<div>
												<Label className="font-medium">
													Notificações por email
												</Label>
												<p className="text-sm text-muted-foreground">
													Receba emails sobre atividades da conta
												</p>
											</div>
											<Switch />
										</div>
										<Separator />
										<div className="flex items-center justify-between">
											<div>
												<Label className="font-medium">Notificações push</Label>
												<p className="text-sm text-muted-foreground">
													Receba notificações no navegador
												</p>
											</div>
											<Switch />
										</div>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
