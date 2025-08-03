import { BadgeCheck, Glasses, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function HomePage() {
	return (
		<>
			{/* Hero Section */}
			<section className="relative h-[400px] md:h-[600px] bg-accent overflow-hidden">
				{/* Desktop Image */}
				<Image
					src="https://s.ygstatic.com/image/promotion/back-to-school-sale/back-to-school-sale--home-l.1920.db40a014-bac.jpg"
					alt="Hero Image"
					fill
					className="object-cover hidden md:block"
				/>

				{/* Mobile Image */}
				<Image
					src="https://s.ygstatic.com/image/promotion/back-to-school-sale/back-to-school-sale--home-s.528.db40a014-36a.jpg"
					alt="Hero Image"
					fill
					className="object-cover block md:hidden"
				/>

				{/* Content overlay positioned on right half */}
				<div className="absolute inset-0 flex flex-col md:flex-row">
					<div className="hidden md:block md:w-1/2" />
					<div className="flex-1 md:w-1/2 flex flex-col md:justify-center items-center px-4 md:px-8 text-center text-white">
						<TextAnimate
							animation="blurInUp"
							by="word"
							once
							as="h1"
							className="text-3xl md:text-6xl font-black mt-10 md:mt-0 text-[#EAFF00] whitespace-nowrap"
						>
							COMPRE 1 LEVE 2
						</TextAnimate>
						<TextAnimate
							animation="blurInUp"
							by="word"
							delay={0.3}
							once
							as="h2"
							className="text-3xl md:text-6xl font-black mb-4 text-[#EAFF00] whitespace-nowrap"
						>
							+ EXTRA 10% OFF
						</TextAnimate>
						<TextAnimate
							className="hidden md:block text-sm md:text-md font-medium"
							animation="blurInUp"
							by="word"
							delay={0.6}
							once
						>
							Mochilas prontas. Óculos postos. Vamos dominar este ano.
						</TextAnimate>
						<TextAnimate
							className="hidden md:block mb-6 text-sm md:text-md font-medium"
							animation="blurInUp"
							by="word"
							delay={0.7}
							once
						>
							Faça a primeira impressão valer a pena com novas armações ousadas.
						</TextAnimate>

						<div className="hidden flex-col md:flex lg:flex-row md:fl gap-3 mb-4">
							<BlurFade delay={1} inView>
								<Button className="bg-[#F80178] hover:bg-[#d10065] cursor-pointer text-white">
									<Link href="#">Comprar Óculos de Grau</Link>
								</Button>
							</BlurFade>
							<BlurFade delay={1.2} inView>
								<Button className="bg-[#F80178] hover:bg-[#d10065] cursor-pointer text-white">
									<Link href="#">Comprar Óculos de Sol</Link>
								</Button>
							</BlurFade>
						</div>

						<h3 className="text-md md:text-xl font-medium">
							<TextAnimate animation="blurInUp" by="word" delay={1.3} once>
								CUPOM: DRVISTA2025
							</TextAnimate>
						</h3>
					</div>
				</div>
			</section>
			<section>
				<ul className="flex flex-row overflow-x-scroll w-full gap-2 lg:justify-center font-medium text-xs bg-muted p-4 rounded-lg">
					<li className="flex items-center gap-2">
						<Glasses className="size-4 text-vibrant" />
						<span className="whitespace-nowrap">
							Lentes de alto índice 1,61 grátis
						</span>
					</li>
					<Separator
						className="bg-accent min-w-0.5 min-h-6"
						orientation="vertical"
					/>
					<li className="flex items-center gap-2">
						<Truck className="size-4 text-vibrant" />
						<span className="whitespace-nowrap">Frete USPS grátis</span>
					</li>
					<Separator
						className="bg-accent min-w-0.5 min-h-6"
						orientation="vertical"
					/>
					<li className="flex items-center gap-2">
						<ShieldCheck className="size-4 text-vibrant" />
						<span className="whitespace-nowrap">
							Garantia de ajuste e estilo de 14 dias
						</span>
					</li>
					<Separator
						className="bg-accent min-w-0.5 min-h-6"
						orientation="vertical"
					/>
					<li className="flex items-center gap-2">
						<BadgeCheck className="size-4 text-vibrant" />
						<span className="whitespace-nowrap">
							Garantia de qualidade de 365 dias
						</span>
					</li>
				</ul>
			</section>
			;
			<section className="p-2 mt-4 flex flex-col gap-4">
				<h2 className="text-lg md:text-3xl text-center font-bold">
					Compre Óculos de Grau Online
				</h2>
				<p className="text-xs md:text-sm text-center">
					Compre óculos de grau e de sol por estilo e personalize de acordo com
					sua receita.
				</p>
			</section>
			;
		</>
	);
}
