import { Award, Lock, Shield } from "lucide-react";
import Link from "next/link";
import { AppLogo, BRAND_CONFIG } from "@/components/brand";
import {
	AmexIcon,
	BoletoIcon,
	EloIcon,
	MastercardIcon,
	PixIcon,
	VisaIcon,
} from "./payment-icons";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./ui/theme-toggle";

const navigation = {
	produtos: [
		{ name: "Óculos de Grau", href: "#" },
		{ name: "Óculos de Sol", href: "#" },
		{ name: "Lentes de Contato", href: "#" },
		{ name: "Óculos Infantis", href: "#" },
		{ name: "Armações", href: "#" },
		{ name: "Acessórios", href: "#" },
	],
	atendimento: [
		{ name: "Central de Ajuda", href: "#" },
		{ name: "Rastreamento de Pedido", href: "#" },
		{ name: "Trocas e Devoluções", href: "#" },
		{ name: "Política de Garantia", href: "#" },
		{ name: "Formas de Pagamento", href: "#" },
		{ name: "Frete e Entrega", href: "#" },
		{ name: "Fale Conosco", href: "#" },
	],
	institucional: [
		{ name: "Quem Somos", href: "#" },
		{ name: "Nossas Lojas", href: "#" },
		{ name: "Trabalhe Conosco", href: "#" },
		{ name: "Blog", href: "#" },
		{ name: "Imprensa", href: "#" },
	],
	servicos: [
		{ name: "Experimente em Casa", href: "#" },
		{ name: "Provador Virtual", href: "#" },
		{ name: "Como Medir o Grau", href: "#" },
		{ name: "Enviar Receita Médica", href: "#" },
	],
	legal: [
		{ name: "Termos de Uso", href: "#" },
		{ name: "Política de Privacidade", href: "#" },
		{ name: "Política de Cookies", href: "#" },
		{ name: "Código de Defesa do Consumidor", href: "#" },
	],
	social: [
		{
			name: "Instagram",
			href: BRAND_CONFIG.social.instagram,
			icon: (props: React.SVGProps<SVGSVGElement>) => (
				<svg
					fill="currentColor"
					viewBox="0 0 24 24"
					{...props}
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
		{
			name: "Facebook",
			href: BRAND_CONFIG.social.facebook,
			icon: (props: React.SVGProps<SVGSVGElement>) => (
				<svg
					fill="currentColor"
					viewBox="0 0 24 24"
					{...props}
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
	],
};

export function Footer() {
	return (
		<footer className="bg-background border-t">
			<div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:pt-24 lg:px-8 lg:pt-32">
				{/* Main footer content */}
				<div className="xl:grid xl:grid-cols-5 xl:gap-8">
					{/* Logo and tagline section */}
					<div className="flex flex-col items-start space-y-4">
						<AppLogo className="w-32" />
						<p className="text-sm text-muted-foreground max-w-xs">
							{BRAND_CONFIG.tagline}
						</p>
					</div>

					{/* Navigation sections */}
					<div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-4 xl:mt-0 xl:grid-cols-5">
						{/* Produtos */}
						<div>
							<h3 className="text-sm font-semibold text-foreground">
								Produtos
							</h3>
							<ul className="mt-6 space-y-4">
								{navigation.produtos.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Atendimento */}
						<div>
							<h3 className="text-sm font-semibold text-foreground">
								Atendimento
							</h3>
							<ul className="mt-6 space-y-4">
								{navigation.atendimento.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Institucional */}
						<div>
							<h3 className="text-sm font-semibold text-foreground">
								Institucional
							</h3>
							<ul className="mt-6 space-y-4">
								{navigation.institucional.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Serviços */}
						<div>
							<h3 className="text-sm font-semibold text-foreground">
								Serviços
							</h3>
							<ul className="mt-6 space-y-4">
								{navigation.servicos.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Jurídico */}
						<div>
							<h3 className="text-sm font-semibold text-foreground">
								Jurídico
							</h3>
							<ul className="mt-6 space-y-4">
								{navigation.legal.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/* Payment methods and trust badges section */}
				<div className="mt-16 pt-8 sm:mt-20 lg:mt-24">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
						{/* Payment methods */}
						<div>
							<div className="flex flex-wrap items-center gap-3">
								<VisaIcon />
								<MastercardIcon />
								<EloIcon />
								<AmexIcon />
								<PixIcon />
								<BoletoIcon />
							</div>
						</div>

						{/* Trust badges */}
						<div className="ml-auto">
							<div className="flex flex-wrap items-center gap-2">
								<Badge
									variant="outline"
									className="flex items-center gap-1.5 px-3 py-1.5"
								>
									<Shield className="size-4" />
									<span className="text-xs">Site Seguro</span>
								</Badge>
								<Badge
									variant="outline"
									className="flex items-center gap-1.5 px-3 py-1.5"
								>
									<Lock className="size-4" />
									<span className="text-xs">Compra Protegida</span>
								</Badge>
								<Badge
									variant="outline"
									className="flex items-center gap-1.5 px-3 py-1.5"
								>
									<Award className="size-4" />
									<span className="text-xs">Reclame Aqui</span>
								</Badge>
							</div>
						</div>
					</div>
				</div>

				{/* Company legal info and social links */}
				<div className="mt-8 pt-8 md:flex md:items-start md:justify-between">
					<div className="space-y-2">
						<p className="text-sm font-semibold text-foreground">
							{BRAND_CONFIG.name} - CNPJ: {BRAND_CONFIG.cnpj}
						</p>
						<p className="text-sm text-muted-foreground">
							{BRAND_CONFIG.address}
						</p>
						<p className="text-sm text-muted-foreground">
							Email: {BRAND_CONFIG.email} | Telefone: {BRAND_CONFIG.phone}
						</p>
					</div>

					<div className="mt-8 md:mt-0 flex items-center gap-x-6">
						{navigation.social.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<span className="sr-only">{item.name}</span>
								<item.icon aria-hidden="true" className="size-6" />
							</Link>
						))}
						<ThemeToggle />
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 pt-8">
					<p className="text-sm text-muted-foreground text-center">
						&copy; {new Date().getFullYear()} {BRAND_CONFIG.name}. Todos os
						direitos reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}
