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
import { ROUTES } from "@/constants/routes";

export default async function HomePage() {
	return (
		<>
			{/* Hero Section */}
			<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto text-center">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-4 sm:px-0">
						Autenticação Segura e Moderna
						<br />
						para Suas Aplicações
					</h1>
					<p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
						Simplifique o gerenciamento de usuários com nossa plataforma de
						autenticação completa. Segurança, simplicidade e escalabilidade em
						um só lugar.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
						<Link href={ROUTES.SIGN_UP} className="w-full sm:w-auto">
							<Button
								size="lg"
								className="flex items-center justify-center space-x-2 w-full sm:w-auto"
							>
								<span>Começar Gratuitamente</span>
								<ArrowRight className="w-4 h-4 text-primary-foreground" />
							</Button>
						</Link>
						<Link href={ROUTES.SIGN_IN} className="w-full sm:w-auto">
							<Button size="lg" variant="outline" className="w-full sm:w-auto">
								Fazer Login
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8 sm:mb-12 px-4 sm:px-0">
						Por que escolher nossa plataforma?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
						<Card className="border-muted hover:border-primary/50 transition-colors">
							<CardHeader>
								<Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3 sm:mb-4 mx-auto sm:mx-0" />
								<CardTitle className="text-lg sm:text-xl text-center sm:text-left">
									Segurança Avançada
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-sm sm:text-base text-center sm:text-left">
									Proteção de dados com criptografia de ponta a ponta,
									autenticação multifator e conformidade com LGPD.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className="border-muted hover:border-primary/50 transition-colors">
							<CardHeader>
								<Zap className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3 sm:mb-4 mx-auto sm:mx-0" />
								<CardTitle className="text-lg sm:text-xl text-center sm:text-left">
									Integração Rápida
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-sm sm:text-base text-center sm:text-left">
									APIs simples e SDKs para as principais linguagens. Integre em
									minutos, não em dias.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className="border-muted hover:border-primary/50 transition-colors">
							<CardHeader>
								<Users className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3 sm:mb-4 mx-auto sm:mx-0" />
								<CardTitle className="text-lg sm:text-xl text-center sm:text-left">
									Gestão Completa
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-sm sm:text-base text-center sm:text-left">
									Dashboard intuitivo para gerenciar usuários, permissões e
									análises em tempo real.
								</CardDescription>
							</CardContent>
						</Card>
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
						<Link
							href={ROUTES.SIGN_UP}
							className="inline-block w-full sm:w-auto"
						>
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
		</>
	);
}
