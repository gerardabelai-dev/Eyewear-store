import {
	BadgeCheck,
	ChevronDown,
	ChevronRight,
	Glasses,
	HeadphonesIcon,
	RotateCcw,
	Shield,
	ShieldCheck,
	ShoppingCart,
	Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Marquee } from "@/components/magicui/marquee";
import { TextAnimate } from "@/components/magicui/text-animate";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
				<ul className="flex flex-row overflow-x-auto w-full gap-2 lg:justify-center font-medium text-xs bg-muted p-4 rounded-lg">
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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-fit mx-auto">
					<Link
						href="/cart/crt_4nfsqo"
						className="flex flex-col items-center gap-2"
					>
						<div className="relative h-48 md:h-32 w-full aspect-video rounded">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<h3>Óculos de Grau</h3>
					</Link>

					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-48 md:h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<h3>Óculos de Sol</h3>
					</Link>

					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-48 md:h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<h3>Óculos Luz Azul</h3>
					</Link>

					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-48 md:h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<h3>Óculos de Leitura</h3>
					</Link>
				</div>
			</section>

			{/* Categories Products Section */}
			<section className="p-2 mt-4 grid items-center justify-items-center gap-8 mx-auto max-w-7xl">
				<div className="grid items-center justify-items-center gap-4">
					<h2 className="text-lg md:text-3xl text-center font-bold">
						Coleções de Óculos em Destaque
					</h2>

					<div className="flex flex-row overflow-x-auto w-full gap-2 lg:justify-center">
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
				<div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 w-full md:w-fit mx-auto">
					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-48 md:h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057080-aatrox.webp"
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
					</Link>

					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-48 md:h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057080-aatrox.webp"
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
					</Link>

					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-48 md:h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057080-aatrox.webp"
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
					</Link>

					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-48 md:h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057080-aatrox.webp"
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
					</Link>

					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-48 md:h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057080-aatrox.webp"
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
					</Link>

					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-48 md:h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057080-aatrox.webp"
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
					</Link>

					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-48 md:h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057080-aatrox.webp"
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
					</Link>

					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-48 md:h-32 w-full aspect-video">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057080-aatrox.webp"
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
					</Link>
				</div>
				<div className="flex flex-col md:flex-row gap-2">
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
				</div>

				<Tabs defaultValue="grau" className="w-full">
					<TabsList className="grid w-fit mx-auto grid-cols-2">
						<TabsTrigger value="grau">Óculos de Grau</TabsTrigger>
						<TabsTrigger value="sol">Óculos de Sol</TabsTrigger>
					</TabsList>

					<TabsContent value="grau" className="mt-8">
						<p className="text-xs md:text-sm text-center mb-8">
							Lentes de alto índice 1,61 grátis com 100% de proteção UV
						</p>
						<div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 w-full md:w-fit mx-auto">
							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
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
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
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
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
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
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
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
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
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
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
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
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
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
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
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
							</Link>
						</div>
					</TabsContent>

					<TabsContent value="sol" className="mt-8">
						<p className="text-xs md:text-sm text-center mb-8">
							Revestimentos antirriscos e antirreflexos gratuitos, com 100% de
							proteção UV
						</p>
						<div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 w-full md:w-fit mx-auto">
							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp"
										alt="Óculos de sol"
										className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
										quality={75}
										fill
									/>
								</div>
								<div className="flex gap-2">
									<strong>Ray-Ban</strong>
									<span>$89</span>
								</div>
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp"
										alt="Óculos de sol"
										className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
										quality={75}
										fill
									/>
								</div>
								<div className="flex gap-2">
									<strong>Oakley</strong>
									<span>$99</span>
								</div>
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp"
										alt="Óculos de sol"
										className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
										quality={75}
										fill
									/>
								</div>
								<div className="flex gap-2">
									<strong>Persol</strong>
									<span>$79</span>
								</div>
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp"
										alt="Óculos de sol"
										className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
										quality={75}
										fill
									/>
								</div>
								<div className="flex gap-2">
									<strong>Maui Jim</strong>
									<span>$109</span>
								</div>
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp"
										alt="Óculos de sol"
										className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
										quality={75}
										fill
									/>
								</div>
								<div className="flex gap-2">
									<strong>Gucci</strong>
									<span>$199</span>
								</div>
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp"
										alt="Óculos de sol"
										className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
										quality={75}
										fill
									/>
								</div>
								<div className="flex gap-2">
									<strong>Prada</strong>
									<span>$159</span>
								</div>
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp"
										alt="Óculos de sol"
										className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
										quality={75}
										fill
									/>
								</div>
								<div className="flex gap-2">
									<strong>Versace</strong>
									<span>$179</span>
								</div>
							</Link>

							<Link href="/cart" className="flex flex-col items-center gap-2">
								<div className="relative h-48 md:h-32 w-full aspect-video">
									<Image
										src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp"
										alt="Óculos de sol"
										className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
										quality={75}
										fill
									/>
								</div>
								<div className="flex gap-2">
									<strong>Tom Ford</strong>
									<span>$149</span>
								</div>
							</Link>
						</div>
					</TabsContent>
				</Tabs>

				<div className="flex gap-2">
					<Button variant="outline">Mais Óculos Populares</Button>
				</div>
			</section>

			{/* Blog Section */}
			<section className="bg-muted p-2 py-20 mt-4 grid items-center justify-items-center gap-8 mx-auto">
				<div className="grid gap-4">
					<h2 className="text-lg md:text-3xl text-center font-bold">
						Blog do Dr. Vista
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl">
					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-52 w-full aspect-video overflow-hidden">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057080-aatrox.webp"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<h3 className="text-lg font-bold">
							Guia de Óculos de Volta às Aulas: Encontrando os Óculos Certos
							para o Novo Ano Letivo
						</h3>
					</Link>
					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-52 w-full aspect-video overflow-hidden">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Zyra_1.jpg"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<h3 className="text-lg font-bold">
							Da praia ao brunch: Como usar seus óculos de sol durante todo o
							verão
						</h3>
					</Link>
					<Link href="/cart" className="flex flex-col items-center gap-2">
						<div className="relative h-52 w-full aspect-video overflow-hidden">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Quinn_1.jpg"
								alt="Óculos de grau"
								className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
								quality={75}
								fill
							/>
						</div>
						<h3 className="text-lg font-bold">
							Como limpar sua flanela para óculos da maneira correta
						</h3>
					</Link>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">Explore Nosso Blog</Button>
				</div>
			</section>

			{/* Blog Section */}
			<section className="p-2 py-20 mt-4 grid items-center justify-items-center gap-8 mx-auto">
				<div className="grid gap-4">
					<h2 className="text-lg md:text-3xl text-center font-bold">
						Avaliações dos Clientes
					</h2>
				</div>

				<div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
					<Marquee pauseOnHover className="[--duration:40s]">
						{Array.from({ length: 10 }).map((_, index) => (
							<div key={index} className="relative w-52 h-72 group">
								<Image
									src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Chogath_5.jpg"
									alt="Óculos de sol"
									className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
									quality={75}
									fill
								/>

								<div className="flex items-center gap-2 absolute bottom-2 left-2 transition-transform duration-300 hover:scale-105">
									<span className="text-white font-medium text-sm drop-shadow-xs">
										John Doe
									</span>
									<ChevronRight className="size-4 text-white" />
								</div>
							</div>
						))}
					</Marquee>
					<Marquee reverse pauseOnHover className="[--duration:40s]">
						{Array.from({ length: 10 }).map((_, index) => (
							<div key={index} className="relative w-52 h-72 group">
								<Image
									src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Kennen_2.jpg"
									alt="Óculos de sol"
									className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
									quality={75}
									fill
								/>

								<div className="flex items-center gap-2 absolute bottom-2 left-2 transition-transform duration-300 hover:scale-105">
									<span className="text-white font-medium text-sm drop-shadow-xs">
										Jane Smith
									</span>
									<ChevronRight className="size-4 text-white" />
								</div>
							</div>
						))}
					</Marquee>
					<div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
					<div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
				</div>

				<div className="flex gap-2">
					<Button variant="outline">Ver Mais Avaliações</Button>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="bg-accent p-2 py-20 mt-4 grid items-center justify-items-center gap-8 mx-auto">
				<div className="grid items-start justify-items-center gap-4 w-full max-w-2xl">
					<h2 className="text-lg md:text-3xl text-left font-bold">
						Perguntas Frequentes
					</h2>
					<p className="text-xs md:text-sm text-left text-muted-foreground">
						Tire suas dúvidas sobre nossos produtos e serviços
					</p>
				</div>

				<div className="w-full max-w-2xl">
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="item-1" className="py-2">
							<AccordionPrimitive.Header className="flex">
								<AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
									<span className="flex items-center gap-3">
										<span
											className="flex size-10 shrink-0 items-center justify-center rounded-full border"
											aria-hidden="true"
										>
											<ShoppingCart size={16} className="opacity-60" />
										</span>
										<span className="flex flex-col space-y-1">
											<span>
												Como faço para escolher o tamanho certo dos óculos?
											</span>
											<span className="text-sm font-normal">
												Guia completo para encontrar o ajuste perfeito
											</span>
										</span>
									</span>
									<ChevronDown
										size={16}
										className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
										aria-hidden="true"
									/>
								</AccordionPrimitive.Trigger>
							</AccordionPrimitive.Header>
							<AccordionContent className="text-muted-foreground ms-3 ps-10 pb-2">
								Para escolher o tamanho ideal, verifique as medidas dos seus
								óculos atuais ou use nossa ferramenta de medição virtual. As
								principais medidas são: largura da lente, ponte nasal e
								comprimento das hastes. Também oferecemos um período de teste de
								30 dias para garantir o ajuste perfeito.
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="item-2" className="py-2">
							<AccordionPrimitive.Header className="flex">
								<AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
									<span className="flex items-center gap-3">
										<span
											className="flex size-10 shrink-0 items-center justify-center rounded-full border"
											aria-hidden="true"
										>
											<Shield size={16} className="opacity-60" />
										</span>
										<span className="flex flex-col space-y-1">
											<span>Qual é a qualidade das lentes oferecidas?</span>
											<span className="text-sm font-normal">
												Informações sobre materiais e proteção UV
											</span>
										</span>
									</span>
									<ChevronDown
										size={16}
										className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
										aria-hidden="true"
									/>
								</AccordionPrimitive.Trigger>
							</AccordionPrimitive.Header>
							<AccordionContent className="text-muted-foreground ms-3 ps-10 pb-2">
								Todas as nossas lentes possuem proteção UV 100% e são feitas com
								materiais de alta qualidade. Oferecemos lentes de alto índice
								1,61 gratuitamente, além de opções premium como antirreflexo,
								filtro de luz azul e lentes fotossensíveis. Todas vêm com
								garantia de 1 ano.
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="item-3" className="py-2">
							<AccordionPrimitive.Header className="flex">
								<AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
									<span className="flex items-center gap-3">
										<span
											className="flex size-10 shrink-0 items-center justify-center rounded-full border"
											aria-hidden="true"
										>
											<Truck size={16} className="opacity-60" />
										</span>
										<span className="flex flex-col space-y-1">
											<span>Qual é o prazo de entrega?</span>
											<span className="text-sm font-normal">
												Informações sobre frete e prazos
											</span>
										</span>
									</span>
									<ChevronDown
										size={16}
										className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
										aria-hidden="true"
									/>
								</AccordionPrimitive.Trigger>
							</AccordionPrimitive.Header>
							<AccordionContent className="text-muted-foreground ms-3 ps-10 pb-2">
								O prazo de entrega varia conforme sua localização: capitais de
								3-5 dias úteis, interior de 5-8 dias úteis. Oferecemos frete
								grátis para compras acima de R$ 200. Você receberá o código de
								rastreamento por email assim que o pedido for despachado.
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="item-4" className="py-2">
							<AccordionPrimitive.Header className="flex">
								<AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
									<span className="flex items-center gap-3">
										<span
											className="flex size-10 shrink-0 items-center justify-center rounded-full border"
											aria-hidden="true"
										>
											<RotateCcw size={16} className="opacity-60" />
										</span>
										<span className="flex flex-col space-y-1">
											<span>Posso trocar ou devolver meus óculos?</span>
											<span className="text-sm font-normal">
												Política de trocas e devoluções
											</span>
										</span>
									</span>
									<ChevronDown
										size={16}
										className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
										aria-hidden="true"
									/>
								</AccordionPrimitive.Trigger>
							</AccordionPrimitive.Header>
							<AccordionContent className="text-muted-foreground ms-3 ps-10 pb-2">
								Sim! Oferecemos 30 dias para trocas e devoluções sem custo
								adicional. Os óculos devem estar em perfeito estado, com
								embalagem original. Para óculos graduados, aceitamos trocas por
								problemas de adaptação mediante avaliação. O processo de troca é
								simples através do nosso site.
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="item-5" className="py-2">
							<AccordionPrimitive.Header className="flex">
								<AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
									<span className="flex items-center gap-3">
										<span
											className="flex size-10 shrink-0 items-center justify-center rounded-full border"
											aria-hidden="true"
										>
											<HeadphonesIcon size={16} className="opacity-60" />
										</span>
										<span className="flex flex-col space-y-1">
											<span>Como posso entrar em contato com o suporte?</span>
											<span className="text-sm font-normal">
												Canais de atendimento disponíveis
											</span>
										</span>
									</span>
									<ChevronDown
										size={16}
										className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
										aria-hidden="true"
									/>
								</AccordionPrimitive.Trigger>
							</AccordionPrimitive.Header>
							<AccordionContent className="text-muted-foreground ms-3 ps-10 pb-2">
								Nossa equipe está disponível de segunda a sexta, das 8h às 18h.
								Você pode nos contatar através do chat online no site, WhatsApp,
								email suporte@ubell.com.br ou telefone 0800-123-4567. Para
								dúvidas sobre pedidos, tenha em mãos seu número de pedido para
								agilizar o atendimento.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</section>
		</>
	);
}
