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
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<Shield className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold text-gray-900 dark:text-gray-100">
								DrVista Admin
							</span>
						</div>
						<nav className="flex items-center space-x-4">
							<Link href="/auth">
								<Button variant="ghost">Entrar</Button>
							</Link>
							<Link href="/auth">
								<Button>Começar</Button>
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto text-center">
					<div className="max-w-3xl mx-auto">
						<h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
							Autenticação Segura
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
								{" "}
								Simplificada
							</span>
						</h1>
						<p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
							Experimente uma plataforma moderna, segura e ultrarrápida para
							autenticação. Desenvolvida para desenvolvedores, amada pelos
							usuários.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/auth">
								<Button size="lg" className="flex items-center space-x-2">
									<span>Começar Agora</span>
									<ArrowRight className="w-4 h-4" />
								</Button>
							</Link>
							<Link href="/dashboard">
								<Button variant="outline" size="lg">
									Ver Dashboard
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
							Por que escolher nossa plataforma?
						</h2>
						<p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
							Construída com tecnologias modernas e melhores práticas para
							garantir que seus dados permaneçam seguros, oferecendo uma
							experiência excepcional ao usuário.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardHeader>
								<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
									<Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
								</div>
								<CardTitle>Segurança Bancária</CardTitle>
								<CardDescription>
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
							<CardHeader>
								<div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
									<Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
								</div>
								<CardTitle>Ultrarrápido</CardTitle>
								<CardDescription>
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

						<Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardHeader>
								<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
									<Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
								</div>
								<CardTitle>Fácil de Usar</CardTitle>
								<CardDescription>
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
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
						Pronto para começar?
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
						Junte-se a milhares de desenvolvedores que confiam em nossa
						plataforma de autenticação.
					</p>
					<Link href="/auth">
						<Button size="lg" className="flex items-center space-x-2">
							<span>Criar Sua Conta</span>
							<ArrowRight className="w-4 h-4" />
						</Button>
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center space-x-2 mb-4 md:mb-0">
							<div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<Shield className="w-4 h-4 text-white" />
							</div>
							<span className="font-semibold text-gray-900 dark:text-gray-100">
								DrVista Admin
							</span>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							© 2024 DrVista Admin. Construído com tecnologias modernas.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
