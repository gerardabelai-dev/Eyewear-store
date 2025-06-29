import { ArrowRight, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
			{/* Header */}
			<header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-14 sm:h-16">
						<div className="flex items-center space-x-2">
							<div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<Shield className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
							</div>
							<span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
								DrVista Admin
							</span>
						</div>
						<nav className="flex items-center space-x-2 sm:space-x-4">
							<Link href="/auth">
								<Button
									variant="ghost"
									size="sm"
									className="hidden sm:inline-flex"
								>
									Entrar
								</Button>
							</Link>
							<Link href="/auth">
								<Button size="sm" className="text-sm px-3 sm:px-4">
									Começar
								</Button>
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto text-center">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight">
							Autenticação Segura
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block sm:inline">
								{" "}
								Simplificada
							</span>
						</h1>
						<p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
							Experimente uma plataforma moderna, segura e ultrarrápida para
							autenticação. Desenvolvida para desenvolvedores, amada pelos
							usuários.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
							<Link href="/auth" className="w-full sm:w-auto">
								<Button
									size="lg"
									className="flex items-center justify-center space-x-2 w-full sm:w-auto"
								>
									<span>Começar Agora</span>
									<ArrowRight className="w-4 h-4" />
								</Button>
							</Link>
							<Link href="/dashboard" className="w-full sm:w-auto">
								<Button
									variant="outline"
									size="lg"
									className="w-full sm:w-auto"
								>
									Ver Dashboard
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12 sm:mb-16">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 px-4 sm:px-0">
							Por que escolher nossa plataforma?
						</h2>
						<p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4 sm:px-0">
							Construída com tecnologias modernas e melhores práticas para
							garantir que seus dados permaneçam seguros, oferecendo uma
							experiência excepcional ao usuário.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
						<Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardHeader className="pb-4">
								<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
									<Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
								</div>
								<CardTitle className="text-lg sm:text-xl">
									Segurança Bancária
								</CardTitle>
								<CardDescription className="text-sm sm:text-base">
									Criptografia e protocolos de segurança empresariais para
									proteger seus dados
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<li>• Criptografia ponta a ponta</li>
									<li>• Autenticação multifator</li>
									<li>• Auditorias regulares de segurança</li>
								</ul>
							</CardContent>
						</Card>

						<Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardHeader className="pb-4">
								<div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
									<Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
								</div>
								<CardTitle className="text-lg sm:text-xl">
									Ultrarrápido
								</CardTitle>
								<CardDescription className="text-sm sm:text-base">
									Performance otimizada com arquitetura moderna para respostas
									instantâneas
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<li>• Autenticação em menos de 1 segundo</li>
									<li>• Distribuição global via CDN</li>
									<li>• Garantia de 99,9% de uptime</li>
								</ul>
							</CardContent>
						</Card>

						<Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
							<CardHeader className="pb-4">
								<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
									<Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
								</div>
								<CardTitle className="text-lg sm:text-xl">
									Fácil de Usar
								</CardTitle>
								<CardDescription className="text-sm sm:text-base">
									Interface intuitiva projetada para a melhor experiência do
									usuário
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<li>• Login social em um clique</li>
									<li>• Design mobile-first</li>
									<li>• Compatível com acessibilidade</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 px-4 sm:px-0">
						Pronto para começar?
					</h2>
					<p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-4 sm:px-0">
						Junte-se a milhares de desenvolvedores que confiam em nossa
						plataforma de autenticação.
					</p>
					<div className="px-4 sm:px-0">
						<Link href="/auth" className="inline-block w-full sm:w-auto">
							<Button
								size="lg"
								className="flex items-center justify-center space-x-2 w-full sm:w-auto"
							>
								<span>Criar minha conta</span>
								<ArrowRight className="w-4 h-4" />
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
					<div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
						<div className="flex items-center space-x-2">
							<div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<Shield className="w-4 h-4 text-white" />
							</div>
							<span className="font-semibold text-gray-900 dark:text-gray-100">
								DrVista Admin
							</span>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-right">
							© 2024 DrVista Admin. Construído com tecnologias modernas.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
