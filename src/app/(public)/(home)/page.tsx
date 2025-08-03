import { BadgeCheck, Glasses, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
						<h1 className="text-3xl md:text-6xl font-black mb-4 mt-10 md:mt-0 text-[#EAFF00]">
							COMPRE 1 LEVE 2
							<br />+ EXTRA 10% OFF
						</h1>
						<p className="hidden md:block mb-6 text-sm md:text-md font-medium">
							Mochilas prontas. Óculos postos. Vamos dominar este ano.
							<br />
							Faça a primeira impressão valer a pena com novas armações ousadas.
						</p>
						<div className="hidden md:flex flex-row gap-3 mb-4">
							<Button className="bg-[#F80178] hover:bg-[#d10065] cursor-pointer text-white">
								<Link href="#">Comprar Óculos de Grau</Link>
							</Button>
							<Button className="bg-[#F80178] hover:bg-[#d10065] cursor-pointer text-white">
								<Link href="#">Comprar Óculos de Sol</Link>
							</Button>
						</div>
						<h3 className="text-md md:text-xl font-medium">
							CUPOM: DRVISTA2025
						</h3>
					</div>
				</div>
			</section>
			<section>
				<ul className="flex flex-col md:flex-row gap-6 md:gap-2 justify-center font-medium text-xs bg-muted p-4 rounded-lg">
					<li className="flex items-center gap-2">
						<Glasses className="size-4 text-vibrant" />
						<span>Lentes de alto índice 1,61 grátis</span>
					</li>
					<Separator
						className="hidden md:block bg-accent min-w-0.5 min-h-6"
						orientation="vertical"
					/>
					<li className="flex items-center gap-2">
						<Truck className="size-4 text-vibrant" />
						<span>Frete USPS grátis</span>
					</li>
					<Separator
						className="hidden md:block bg-accent min-w-0.5 min-h-6"
						orientation="vertical"
					/>
					<li className="flex items-center gap-2">
						<ShieldCheck className="size-4 text-vibrant" />
						<span>Garantia de ajuste e estilo de 14 dias</span>
					</li>
					<Separator
						className="hidden md:block bg-accent min-w-0.5 min-h-6"
						orientation="vertical"
					/>
					<li className="flex items-center gap-2">
						<BadgeCheck className="size-4 text-vibrant" />
						<span>Garantia de qualidade de 365 dias</span>
					</li>
				</ul>
			</section>
		</>
	);
}
