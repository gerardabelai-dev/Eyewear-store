"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Suspense, useEffect, useState } from "react";
import {
	AppCompanyInfo,
	AppLogo,
	BRAND_CONFIG,
} from "@/components/shared/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { NotificationPreferences } from "@/lib/notifications/types";

interface UnsubscribeToken {
	userId: string;
	notificationId: string;
	email: string;
	iat: number;
}

interface UserPreferences extends NotificationPreferences {
	id: string;
	userId: string;
}

function UnsubscribePageContent() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [tokenData, setTokenData] = useState<UnsubscribeToken | null>(null);
	const [preferences, setPreferences] = useState<UserPreferences | null>(null);

	// Decode and validate token
	useEffect(() => {
		if (!token) {
			setError("Token de cancelamento inválido");
			setIsLoading(false);
			return;
		}

		try {
			const decoded = JSON.parse(Buffer.from(token, "base64url").toString());
			setTokenData(decoded);

			// Fetch user preferences
			fetchUserPreferences(decoded.userId);
		} catch (err) {
			setError("Token de cancelamento inválido");
			setIsLoading(false);
		}
	}, [token]);

	const fetchUserPreferences = async (userId: string) => {
		try {
			const response = await fetch(
				`/api/notifications/preferences?userId=${userId}`,
			);
			if (!response.ok) {
				throw new Error("Falha ao carregar preferências");
			}

			const data = await response.json();
			setPreferences(data.preferences);
		} catch (err) {
			console.error("Error fetching preferences:", err);
			setError("Falha ao carregar suas preferências de notificação");
		} finally {
			setIsLoading(false);
		}
	};

	const updatePreferences = async (
		newPreferences: Partial<NotificationPreferences>,
	) => {
		if (!tokenData || !preferences) return;

		setSaving(true);
		setError(null);

		try {
			const response = await fetch("/api/notifications/preferences", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: tokenData.userId,
					preferences: newPreferences,
				}),
			});

			if (!response.ok) {
				throw new Error("Falha ao atualizar preferências");
			}

			const data = await response.json();
			setPreferences(data.preferences);
			setSuccess(true);

			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(false), 3000);
		} catch (err) {
			console.error("Error updating preferences:", err);
			setError("Falha ao atualizar suas preferências");
		} finally {
			setSaving(false);
		}
	};

	const handlePreferenceChange = (
		key: keyof NotificationPreferences,
		value: boolean,
	) => {
		if (!preferences) return;

		const newPreferences = { ...preferences, [key]: value };
		setPreferences(newPreferences);
		updatePreferences({ [key]: value });
	};

	const unsubscribeFromAll = async () => {
		if (!tokenData) return;

		setSaving(true);
		setError(null);

		try {
			const response = await fetch("/api/notifications/unsubscribe-all", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: tokenData.userId,
				}),
			});

			if (!response.ok) {
				throw new Error("Falha ao cancelar todas as inscrições");
			}

			// Update all preferences to false
			setPreferences((prev) =>
				prev
					? {
							...prev,
							marketing: false,
							orderUpdates: true, // Keep order updates for transactional purposes
							systemNotifications: false,
							promotions: false,
							newsletters: false,
							emailEnabled: true, // Keep email enabled for essential communications
							smsEnabled: false,
							pushEnabled: false,
							whatsappEnabled: false,
						}
					: null,
			);

			setSuccess(true);
		} catch (err) {
			console.error("Error unsubscribing from all:", err);
			setError("Falha ao cancelar todas as inscrições");
		} finally {
			setSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">
						Carregando suas preferências...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<Card className="max-w-md w-full">
					<CardHeader className="text-center">
						<AppLogo size="lg" />
						<CardTitle className="text-destructive">Erro</CardTitle>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-muted-foreground mb-4">{error}</p>
						<Button
							onClick={() => {
								window.location.href = BRAND_CONFIG.website;
							}}
							variant="outline"
						>
							Voltar ao Site
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background py-8">
			<div className="max-w-2xl mx-auto p-4">
				{/* Header */}
				<div className="text-center mb-8">
					<AppLogo size="xl" className="justify-center mb-4" />
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Preferências de Notificação
					</h1>
					<p className="text-muted-foreground">
						Gerencie como e quando você deseja receber nossas comunicações
					</p>
					{tokenData?.email && (
						<Badge variant="outline" className="mt-2">
							{tokenData.email}
						</Badge>
					)}
				</div>

				{/* Success message */}
				{success && (
					<div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<span className="text-primary text-xl">✓</span>
							</div>
							<div className="ml-3">
								<p className="text-primary">
									Suas preferências foram atualizadas com sucesso!
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Main preferences card */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Tipos de Notificação</CardTitle>
						<CardDescription>
							Escolha quais tipos de email você deseja receber
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Email Types */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<label className="font-medium text-gray-900">
										Marketing e Novidades
									</label>
									<p className="text-sm text-gray-500">
										Novidades sobre produtos, dicas e conteúdo educativo
									</p>
								</div>
								<Switch
									checked={preferences?.marketing || false}
									onCheckedChange={(checked) =>
										handlePreferenceChange("marketing", checked)
									}
									disabled={isSaving}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex-1">
									<label className="font-medium text-gray-900">
										Atualizações de Pedidos
									</label>
									<p className="text-sm text-gray-500">
										Confirmações, status de envio e entrega dos seus pedidos
									</p>
								</div>
								<Switch
									checked={preferences?.orderUpdates || false}
									onCheckedChange={(checked) =>
										handlePreferenceChange("orderUpdates", checked)
									}
									disabled={isSaving}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex-1">
									<label className="font-medium text-gray-900">
										Notificações do Sistema
									</label>
									<p className="text-sm text-gray-500">
										Atualizações de conta, segurança e manutenção
									</p>
								</div>
								<Switch
									checked={preferences?.systemNotifications || false}
									onCheckedChange={(checked) =>
										handlePreferenceChange("systemNotifications", checked)
									}
									disabled={isSaving}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex-1">
									<label className="font-medium text-gray-900">
										Promoções e Ofertas
									</label>
									<p className="text-sm text-gray-500">
										Descontos exclusivos, cupons e ofertas especiais
									</p>
								</div>
								<Switch
									checked={preferences?.promotions || false}
									onCheckedChange={(checked) =>
										handlePreferenceChange("promotions", checked)
									}
									disabled={isSaving}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex-1">
									<label className="font-medium text-gray-900">
										Newsletter
									</label>
									<p className="text-sm text-gray-500">
										Conteúdo semanal com tendências e insights do setor
									</p>
								</div>
								<Switch
									checked={preferences?.newsletters || false}
									onCheckedChange={(checked) =>
										handlePreferenceChange("newsletters", checked)
									}
									disabled={isSaving}
								/>
							</div>
						</div>

						<Separator />

						{/* Channel Preferences */}
						<div>
							<h3 className="font-medium text-gray-900 mb-4">
								Canais de Comunicação
							</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<label className="font-medium text-gray-700">Email</label>
										<p className="text-sm text-gray-500">
											Receber notificações por email
										</p>
									</div>
									<Switch
										checked={preferences?.emailEnabled || false}
										onCheckedChange={(checked) =>
											handlePreferenceChange("emailEnabled", checked)
										}
										disabled={isSaving}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex-1">
										<label className="font-medium text-gray-700">SMS</label>
										<p className="text-sm text-gray-500">
											Receber notificações por mensagem de texto
										</p>
									</div>
									<Switch
										checked={preferences?.smsEnabled || false}
										onCheckedChange={(checked) =>
											handlePreferenceChange("smsEnabled", checked)
										}
										disabled={isSaving}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex-1">
										<label className="font-medium text-gray-700">
											Push (Navegador)
										</label>
										<p className="text-sm text-gray-500">
											Notificações push no navegador
										</p>
									</div>
									<Switch
										checked={preferences?.pushEnabled || false}
										onCheckedChange={(checked) =>
											handlePreferenceChange("pushEnabled", checked)
										}
										disabled={isSaving}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex-1">
										<label className="font-medium text-gray-700">
											WhatsApp
										</label>
										<p className="text-sm text-gray-500">
											Receber notificações pelo WhatsApp
										</p>
									</div>
									<Switch
										checked={preferences?.whatsappEnabled || false}
										onCheckedChange={(checked) =>
											handlePreferenceChange("whatsappEnabled", checked)
										}
										disabled={isSaving}
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Unsubscribe all section */}
				<Card className="border-destructive/20">
					<CardHeader>
						<CardTitle className="text-destructive">
							Cancelar Todas as Inscrições
						</CardTitle>
						<CardDescription>
							Se você não deseja mais receber nenhum email nosso (exceto
							comunicações essenciais relacionadas a pedidos)
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							variant="destructive"
							onClick={unsubscribeFromAll}
							disabled={isSaving}
							className="w-full"
						>
							{isSaving ? "Processando..." : "Cancelar Todas as Inscrições"}
						</Button>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="text-center mt-8 pt-8 border-t border-gray-200">
					<AppCompanyInfo variant="contact" className="justify-center mb-4" />
					<p className="text-sm text-gray-500 mb-4">
						Você pode alterar suas preferências a qualquer momento clicando no
						link "Gerenciar preferências" em qualquer um dos nossos emails.
					</p>
					<div className="flex justify-center gap-4">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								window.location.href = BRAND_CONFIG.website;
							}}
						>
							Voltar ao Site
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								window.location.href = `${BRAND_CONFIG.website}/privacidade`;
							}}
						>
							Política de Privacidade
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function UnsubscribePage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
					<Card className="w-full max-w-2xl">
						<CardHeader className="text-center">
							<div className="flex justify-center mb-4">
								<AppLogo />
							</div>
							<CardTitle>Carregando...</CardTitle>
							<CardDescription>
								Processando sua solicitação de cancelamento de inscrição.
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			}
		>
			<UnsubscribePageContent />
		</Suspense>
	);
}
