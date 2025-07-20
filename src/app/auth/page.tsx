"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import SignIn from "@/components/sign-in";
import SignUp from "@/components/sign-up";
import { Button } from "@/components/ui/button";

function AuthPageContent() {
	const [showSignUp, setShowSignUp] = useState(false);
	const [isProcessingImpersonation, setIsProcessingImpersonation] =
		useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();

	// Handle impersonation token on component mount
	useEffect(() => {
		const impersonationToken = searchParams.get("impersonationToken");
		const sessionToken = searchParams.get("sessionToken");

		if (impersonationToken && sessionToken) {
			handleImpersonation(impersonationToken, sessionToken);
		}
	}, [searchParams]);

	const handleImpersonation = async (
		impersonationToken: string,
		sessionToken: string,
	) => {
		setIsProcessingImpersonation(true);

		try {
			// Validate the impersonation token
			const response = await fetch("/api/admin/impersonation/validate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					impersonationToken,
					sessionToken,
				}),
			});

			if (response.ok) {
				const result = await response.json();

				// Store the session token in a way that Better Auth can use it
				// This might need to be adjusted based on how Better Auth handles sessions
				document.cookie = `better-auth.session_token=${sessionToken}; path=/; secure; samesite=strict`;

				toast.success(`Impersonando usuário: ${result.data.user.email}`);

				// Clear URL params and redirect to dashboard
				router.replace("/dashboard");
			} else {
				const error = await response.json();
				toast.error(`Erro na impersonação: ${error.error}`);

				// Clear URL params on error
				router.replace("/auth");
			}
		} catch (error) {
			console.error("Impersonation error:", error);
			toast.error("Erro na impersonação");

			// Clear URL params on error
			router.replace("/auth");
		} finally {
			setIsProcessingImpersonation(false);
		}
	};

	// Show loading state while processing impersonation
	if (isProcessingImpersonation) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="w-full max-w-md mx-auto p-4 text-center">
					<div className="flex justify-center mb-8">
						<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
							<Shield className="w-6 h-6 text-white" />
						</div>
					</div>
					<h2 className="text-xl font-semibold mb-4">
						Processando Impersonação...
					</h2>
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="w-full max-w-md mx-auto p-4">
				{/* Logo */}
				<div className="flex justify-center mb-8">
					<Link
						href="/"
						className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
					>
						<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
							<Shield className="w-6 h-6 text-white" />
						</div>
						<span className="text-2xl font-bold">DrVista Admin</span>
					</Link>
				</div>

				{/* Toggle Buttons */}
				<div className="flex rounded-lg bg-muted p-1 mb-8">
					<Button
						variant={!showSignUp ? "default" : "ghost"}
						className="flex-1 text-sm"
						onClick={() => setShowSignUp(false)}
					>
						Entrar
					</Button>
					<Button
						variant={showSignUp ? "default" : "ghost"}
						className="flex-1 text-sm"
						onClick={() => setShowSignUp(true)}
					>
						Cadastrar
					</Button>
				</div>

				{/* Auth Components */}
				<div className="w-full">{showSignUp ? <SignUp /> : <SignIn />}</div>
			</div>
		</div>
	);
}

export default function AuthPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
					<div className="w-full max-w-md space-y-6">
						<div className="text-center space-y-2">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4">
								<Shield className="w-8 h-8 text-white" />
							</div>
							<h1 className="text-2xl font-bold text-gray-900">
								Carregando...
							</h1>
							<p className="text-gray-600">
								Preparando a página de autenticação.
							</p>
						</div>
					</div>
				</div>
			}
		>
			<AuthPageContent />
		</Suspense>
	);
}
