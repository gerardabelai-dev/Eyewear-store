import { ArrowRight, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";
import { AppLogo } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Fast Refresh Test - this comment should update immediately
export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-background/80 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-14 sm:h-16">
						<AppLogo size="md" showText={true} />
						<nav className="flex items-center space-x-2 sm:space-x-4">
							<ThemeToggle />
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
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 px-4 sm:px-0">
						Plataforma de{" "}
						<span className="text-primary">Autenticação Segura</span>
					</h1>
					<p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0">
						Sistema administrativo moderno com autenticação robusta, interface
						intuitiva e ferramentas avançadas para gestão completa de usuários e
						permissões.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
						<Link href="/auth" className="w-full sm:w-auto">
							<Button
								size="lg"
								className="flex items-center justify-center space-x-2 w-full sm:w-auto"
							>
								<span>Começar Agora</span>
								<ArrowRight className="w-4 h-4 text-primary-foreground" />
							</Button>
						</Link>
						<Link href="/auth" className="w-full sm:w-auto">
							<Button variant="outline" size="lg" className="w-full sm:w-auto">
								Fazer Login
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-12 sm:py-16 lg:py-20 bg-muted/30 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-8 sm:mb-12">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-4 sm:px-0">
							Recursos Avançados
						</h2>
						<p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
							Tudo que você precisa para gerenciar autenticação e usuários de
							forma eficiente e segura.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
						<Card className="text-center">
							<CardHeader>
								<div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
									<Shield className="w-6 h-6 text-primary" />
								</div>
								<CardTitle className="text-lg sm:text-xl">
									Segurança Avançada
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-sm sm:text-base">
									Autenticação multifator, criptografia de ponta e proteção
									contra ataques modernos.
								</CardDescription>
							</CardContent>
						</Card>
						<Card className="text-center">
							<CardHeader>
								<div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
									<Users className="w-6 h-6 text-primary" />
								</div>
								<CardTitle className="text-lg sm:text-xl">
									Gestão de Usuários
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-sm sm:text-base">
									Interface intuitiva para gerenciar usuários, permissões e
									grupos de acesso.
								</CardDescription>
							</CardContent>
						</Card>
						<Card className="text-center md:col-span-2 lg:col-span-1">
							<CardHeader>
								<div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
									<Zap className="w-6 h-6 text-primary" />
								</div>
								<CardTitle className="text-lg sm:text-xl">
									Alta Performance
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-sm sm:text-base">
									Sistema otimizado com tempos de resposta rápidos e
									escalabilidade enterprise.
								</CardDescription>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto text-center">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-8 sm:mb-12 px-4 sm:px-0">
						Confiado por Desenvolvedores
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
						<div className="text-center">
							<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
								10K+
							</div>
							<div className="text-sm sm:text-base text-muted-foreground">
								Usuários Ativos
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
								99.9%
							</div>
							<div className="text-sm sm:text-base text-muted-foreground">
								Uptime Garantido
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
								500+
							</div>
							<div className="text-sm sm:text-base text-muted-foreground">
								Aplicações Integradas
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
								24/7
							</div>
							<div className="text-sm sm:text-base text-muted-foreground">
								Suporte Técnico
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 px-4 sm:px-0">
						Pronto para começar?
					</h2>
					<p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 px-4 sm:px-0">
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
								<ArrowRight className="w-4 h-4 text-primary-foreground" />
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t bg-background/80 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
					<div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
						<AppLogo size="sm" showText={true} />
						<p className="text-sm text-muted-foreground text-center sm:text-right">
							© 2024 DrVista Admin. Construído com tecnologias modernas.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
