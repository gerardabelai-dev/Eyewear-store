import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
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
import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { formatPrice } from "@/lib/format-price";
import { ProductItem } from "./product-item";

// Type definitions
type ProductWithDetails = {
	id: string;
	name: string;
	price: string;
	image: string;
	href: string;
};

// Server-side data fetching
async function getFeaturedProducts(): Promise<ProductWithDetails[]> {
	try {
		const products = await db.query.product.findMany({
			where: eq(product.status, "active"),
			with: {
				images: {
					limit: 1,
				},
				productPrice: {
					where: (productPrice, { eq }) => eq(productPrice.isDefault, true),
					limit: 1,
				},
			},
			limit: 8,
		});

		return products.map((product) => ({
			id: product.id,
			name: product.name,
			price: formatPrice(product.productPrice[0]?.priceInCents || 0),
			image: product.images[0]?.imageUrl || "/placeholder-product.jpg",
			href: `/products/${product.id}`,
		}));
	} catch (error) {
		console.error("Error fetching featured products:", error);
		return [];
	}
}

async function getCollectionProducts(): Promise<ProductWithDetails[]> {
	try {
		const products = await db.query.product.findMany({
			where: eq(product.status, "active"),
			with: {
				images: {
					limit: 1,
				},
				productPrice: {
					where: (productPrice, { eq }) => eq(productPrice.isDefault, true),
					limit: 1,
				},
			},
			limit: 4,
		});

		return products.map((product) => ({
			id: product.id,
			name: product.name,
			price: formatPrice(product.productPrice[0]?.priceInCents || 0),
			image: product.images[0]?.imageUrl || "/placeholder-product.jpg",
			href: `/products/${product.id}`,
		}));
	} catch (error) {
		console.error("Error fetching collection products:", error);
		return [];
	}
}

// Mock product data - fallback for sections not yet connected to DB
const collectionsData: ProductWithDetails[] = [
	{
		id: "grau",
		name: "Óculos de Grau",
		price: "R$ 199,00",
		href: "/cart/crt_4nfsqo",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp",
	},
	{
		id: "sol",
		name: "Óculos de Sol",
		price: "R$ 149,00",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp",
	},
	{
		id: "luz-azul",
		name: "Óculos Luz Azul",
		price: "R$ 179,00",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp",
	},
	{
		id: "leitura",
		name: "Óculos de Leitura",
		price: "R$ 129,00",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057069-akali.webp",
	},
];

const featuredProductsData = Array.from({ length: 8 }, (_, index) => ({
	id: `featured-${index + 1}`,
	name: "Ubell",
	price: "$39",
	href: "/cart",
	image:
		"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057080-aatrox.webp",
}));

const bestSellersGrauData = Array.from({ length: 8 }, (_, index) => ({
	id: `grau-${index + 1}`,
	name: "Ubell",
	price: "$39",
	href: "/cart",
	image:
		"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg",
}));

const bestSellersSolData = [
	{
		id: "sol-1",
		name: "Ray-Ban",
		price: "$89",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp",
	},
	{
		id: "sol-2",
		name: "Oakley",
		price: "$99",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp",
	},
	{
		id: "sol-3",
		name: "Persol",
		price: "$79",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp",
	},
	{
		id: "sol-4",
		name: "Maui Jim",
		price: "$109",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp",
	},
	{
		id: "sol-5",
		name: "Gucci",
		price: "$199",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp",
	},
	{
		id: "sol-6",
		name: "Prada",
		price: "$159",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp",
	},
	{
		id: "sol-7",
		name: "Versace",
		price: "$179",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp",
	},
	{
		id: "sol-8",
		name: "Tom Ford",
		price: "$149",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/1752986057077-ahri.webp",
	},
];

const blogPostsData = [
	{
		id: "blog-1",
		title:
			"Guia de Óculos de Volta às Aulas: Encontrando os Óculos Certos para o Novo Ano Letivo",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/blogs/artem-mihailov-5aKB1P_fcLw-unsplash-vL8EAmmliVsMqxmNJEHi0iUNcL7fiS.jpg",
	},
	{
		id: "blog-2",
		title:
			"Da praia ao brunch: Como usar seus óculos de sol durante todo o verão",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/blogs/becca-tapert-GnY_mW1Q6Xc-unsplash-Ttwh643sGghN5qSZuoXx2AoqugExI6.jpg",
	},
	{
		id: "blog-3",
		title: "Como limpar sua flanela para óculos da maneira correta",
		href: "/cart",
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/blogs/mehrab-chi-pg78watFkw0-unsplash-9IVcuUGCtGGLMqU5lyV4Ps2y2OVee6.jpg",
	},
];

// Set a consistent seed for faker to ensure the same names are generated each time
faker.seed(12345);

const customerReviewsData = [
	{
		id: "review-1",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses--zu-M0NVnqo-unsplash-QLaPxkVlvESa2jcCVIRuI6w7yV4qNW.jpg",
	},
	{
		id: "review-2",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-08E_4V_uHtQ-unsplash-HGb11Z54767fWvMBT927CoxPLV6iWb.jpg",
	},
	{
		id: "review-3",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-32UtlKnKkWA-unsplash-1pW5AYtcj8V0tnz71AUT9wWdYBGbcq.jpg",
	},
	{
		id: "review-4",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-4Z6JZHafP_c-unsplash-Q12NP2hUPoMHYsMstg5RuFMGd31kx2.jpg",
	},
	{
		id: "review-5",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-7qsdLxXtJfg-unsplash-QpOQDn5VIRFlKMvFOvzoKDCdduaanm.jpg",
	},
	{
		id: "review-6",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-9nbzZ8ZimU0-unsplash-SlSnWkTgclfiBoY13vLad0C6UEP1nE.jpg",
	},
	{
		id: "review-7",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-AbeC2NzyCAw-unsplash-dyo26RJJYgAz7wROoqaZsF2ylIOOMW.jpg",
	},
	{
		id: "review-8",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-JM1NtaVl6Pg-unsplash-DwPWLAwg5wq88xoQKquyx0DOGvxO1z.jpg",
	},
	{
		id: "review-9",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-VUQmxlzP77w-unsplash-2a5LpdMzVDJpmKXrYz8DZhEYCFHxXJ.jpg",
	},
	{
		id: "review-10",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-T8OZ1Ug0hQY-unsplash-rlEzj2tztVFPGqajlXTDIBcnaxi3Xq.jpg",
	},
	{
		id: "review-11",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-aShmUdodJ3w-unsplash-WF2QNTPEiWczBhb6ZTjCp0uw52v8cl.jpg",
	},
	{
		id: "review-12",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-f93dxS2W9vU-unsplash-KET1n7VXGNBNDZlfFJ1tlyC8ZUlPP6.jpg",
	},
	{
		id: "review-13",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-trsE5rHBjvs-unsplash-QDwFEiTdepqkmJ1aMIp5UO10FgKby9.jpg",
	},
	{
		id: "review-14",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-yAMzhbNmLSk-unsplash-Cj7qSydZ1Ok8ToVnTtPZRlB4ORunJ4.jpg",
	},
	{
		id: "review-15",
		name: faker.person.fullName(),
		image:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-z70QhrZ03Bo-unsplash-PMgHWe5vVKSs163MZWDly41Qt4ifIL.jpg",
	},
];

export default async function HomePage() {
	// Fetch data on the server
	const [featuredProducts, collectionProducts] = await Promise.all([
		getFeaturedProducts(),
		getCollectionProducts(),
	]);

	// Use fetched data or fallback to mock data
	const collectionsToShow =
		collectionProducts.length > 0 ? collectionProducts : collectionsData;
	return (
		<>
			{/* Hero Section */}
			<section className="relative h-[400px] md:h-[600px] bg-accent overflow-hidden">
				{/* Desktop Image */}
				<Image
					src="https://s.ygstatic.com/image/promotion/back-to-school-sale/back-to-school-sale--home-l.1920.db40a014-bac.jpg"
					alt="Hero Image"
					fill
					sizes="100vw"
					className="object-cover hidden md:block"
				/>

				{/* Mobile Image */}
				<Image
					src="https://s.ygstatic.com/image/promotion/back-to-school-sale/back-to-school-sale--home-s.528.db40a014-36a.jpg"
					alt="Hero Image"
					fill
					sizes="100vw"
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
					{collectionsToShow.map((collection) => (
						<ProductItem
							key={collection.id}
							id={collection.id}
							name={collection.name}
							price={collection.price}
							image={collection.image}
							showPrice={collectionProducts.length > 0}
							imageClassName="relative h-48 md:h-32 w-full aspect-video rounded"
						/>
					))}
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
					{featuredProducts.length > 0
						? featuredProducts.map((product) => (
								<ProductItem
									key={product.id}
									id={product.id}
									name={product.name}
									price={product.price}
									image={product.image}
									alt="Produto em destaque"
								/>
							))
						: featuredProductsData.map((product) => (
								<ProductItem
									key={product.id}
									id={product.id}
									name={product.name}
									price={product.price}
									image={product.image}
									alt="Óculos de grau"
								/>
							))}
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
							{featuredProducts.length > 0
								? featuredProducts.map((product) => (
										<ProductItem
											key={`grau-${product.id}`}
											id={product.id}
											name={product.name}
											price={product.price}
											image={product.image}
											alt="Óculos de grau"
										/>
									))
								: bestSellersGrauData.map((product) => (
										<ProductItem
											key={product.id}
											id={product.id}
											name={product.name}
											price={product.price}
											image={product.image}
											alt="Óculos de grau"
										/>
									))}
						</div>
					</TabsContent>

					<TabsContent value="sol" className="mt-8">
						<p className="text-xs md:text-sm text-center mb-8">
							Revestimentos antirriscos e antirreflexos gratuitos, com 100% de
							proteção UV
						</p>
						<div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 w-full md:w-fit mx-auto">
							{featuredProducts.length > 0
								? featuredProducts.map((product) => (
										<ProductItem
											key={`sol-${product.id}`}
											id={product.id}
											name={product.name}
											price={product.price}
											image={product.image}
											alt="Óculos de sol"
										/>
									))
								: bestSellersSolData.map((product) => (
										<ProductItem
											key={product.id}
											id={product.id}
											name={product.name}
											price={product.price}
											image={product.image}
											alt="Óculos de sol"
										/>
									))}
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
					{blogPostsData.map((post) => (
						<Link
							key={post.id}
							href={post.href}
							className="flex flex-col items-center gap-2"
						>
							<div className="relative h-52 w-full aspect-video overflow-hidden">
								<Image
									src={post.image}
									alt="Blog post"
									className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
									quality={75}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</div>
							<h3 className="text-lg font-bold">{post.title}</h3>
						</Link>
					))}
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
						{Array.from({ length: 12 }).map((_, index) => {
							const review =
								customerReviewsData[index % customerReviewsData.length];
							return (
								<div
									key={`marquee1-${index}`}
									className="relative w-52 h-72 group"
								>
									<Image
										src={review.image}
										alt="Customer review"
										className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
										quality={75}
										fill
										sizes="208px"
										unoptimized={false}
										priority={false}
									/>

									<div className="flex items-center gap-2 absolute bottom-2 left-2 transition-transform duration-300 hover:scale-105">
										<span className="text-white font-medium text-sm drop-shadow-xs">
											{review.name}
										</span>
										<ChevronRight className="size-4 text-white" />
									</div>
								</div>
							);
						})}
					</Marquee>
					<Marquee reverse pauseOnHover className="[--duration:40s]">
						{Array.from({ length: 12 }).map((_, index) => {
							const reviewIndex = (index + 9) % customerReviewsData.length; // Offset to show different reviews
							const review = customerReviewsData[reviewIndex];
							return (
								<div
									key={`marquee2-${index}`}
									className="relative w-52 h-72 group"
								>
									<Image
										src={review.image}
										alt="Customer review"
										className="object-cover rounded transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
										quality={75}
										fill
										sizes="208px"
										unoptimized={false}
										priority={false}
									/>

									<div className="flex items-center gap-2 absolute bottom-2 left-2 transition-transform duration-300 hover:scale-105">
										<span className="text-white font-medium text-sm drop-shadow-xs">
											{review.name}
										</span>
										<ChevronRight className="size-4 text-white" />
									</div>
								</div>
							);
						})}
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
