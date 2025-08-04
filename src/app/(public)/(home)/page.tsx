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
					<div className="flex-1 md:w-1/2 flex flex-col md:justify-items-center items-center px-4 md:px-8 text-center text-white">
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

			{/* Collections Products Section */}
			<section className="p-2 mt-4 grid gap-8 mx-auto max-w-7xl">
				<div className="grid gap-4">
					<h2 className="text-lg md:text-3xl text-center font-bold">
						Compre Óculos de Grau Online
					</h2>
					<p className="text-xs md:text-sm text-center">
						Compre óculos de grau e de sol por estilo e personalize de acordo
						com sua receita.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-fit mx-auto">
					<div className="flex flex-col items-center gap-2">
						<div className="relative h-32 w-full aspect-video rounded">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<h3>Óculos de Grau</h3>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<h3>Óculos de Sol</h3>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<h3>Óculos Luz Azul</h3>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<h3>Óculos de Leitura</h3>
					</div>
				</div>
			</section>

			{/* Categories Products Section */}
			<section className="p-2 mt-4 grid items-center justify-items-center gap-8 mx-auto max-w-7xl">
				<div className="grid items-center justify-items-center gap-4">
					<h2 className="text-lg md:text-3xl text-center font-bold">
						Coleções de Óculos em Destaque
					</h2>

					<div className="flex gap-2">
						<Button variant="default">Todos</Button>
						<Button variant="secondary">Gatinho</Button>
						<Button variant="secondary">Aviador</Button>
						<Button variant="secondary">Redondo</Button>
						<Button variant="secondary">Quadrado</Button>
						<Button variant="secondary">Oversized</Button>
						<Button variant="secondary">Hipster</Button>
						<Button variant="secondary">Wide</Button>
					</div>
				</div>
				<div className="grid items-center justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 w-fit mx-auto">
					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">Mais Óculos de Grau</Button>
					<Button variant="outline">Mais Óculos de Sol</Button>
				</div>
			</section>

			{/* Most Popular Products Section */}
			<section className="p-2 mt-4 grid items-center justify-items-center gap-8 mx-auto max-w-7xl">
				<div className="grid items-center justify-items-center gap-4">
					<h2 className="text-lg md:text-3xl text-center font-bold">
						Óculos Mais Vendidos
					</h2>
					<p className="text-xs md:text-sm text-center">
						Lentes de alto índice 1,61 grátis com 100% de proteção UV
					</p>

					<div className="flex gap-2">
						<Button variant="default">Óculos de Grau</Button>
						<Button variant="secondary">Óculos de Sol</Button>
					</div>
				</div>
				<div className="grid items-center justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 w-fit mx-auto">
					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<div className="flex gap-2">
							<strong>Ubell</strong>
							<span>$39</span>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">Mais Óculos Populares</Button>
				</div>
			</section>
		</>
	);
}
