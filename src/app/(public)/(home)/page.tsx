import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
		</>
	);
}
