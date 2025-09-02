import { PlusIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ColorVariantPicker } from "./color-variant-picker";

const accordionItems = [
	{
		id: "1",
		title: "Como escolher o tamanho ideal dos óculos?",
		content:
			"Para escolher o tamanho ideal, meça a largura do seu rosto e compare com as medidas do produto. Nossos óculos possuem medidas padronizadas: largura da lente, ponte e haste. Consulte nosso guia de medidas ou entre em contato para orientação personalizada.",
	},
	{
		id: "2",
		title: "Qual é a garantia dos óculos?",
		content:
			"Oferecemos 12 meses de garantia contra defeitos de fabricação nas armações e 6 meses nas lentes. A garantia cobre quebras por defeito do material, mas não inclui danos por mau uso ou acidentes.",
	},
	{
		id: "3",
		title: "Vocês fazem lentes com grau?",
		content:
			"Sim, trabalhamos com lentes oftálmicas de alta qualidade. Aceitamos receitas para miopia, hipermetropia, astigmatismo e presbiopia. Também oferecemos lentes multifocais, antirreflexo e com proteção UV.",
	},
	{
		id: "4",
		title: "Como funciona a troca e devolução?",
		content:
			"Você tem 30 dias para trocar ou devolver o produto. Os óculos devem estar em perfeito estado, com embalagem original. Para lentes com grau, a troca só é aceita em caso de erro na confecção. Frete de devolução por nossa conta.",
	},
];

const customerReviews = [
	{
		id: 1,
		rating: 5,
		content: `
      <p>Estes óculos são exatamente o que eu precisava! O design é perfeito e a qualidade das lentes é excepcional. Super confortáveis para usar o dia todo. Recomendo!</p>
    `,
		date: "16 de julho, 2021",
		datetime: "2021-07-16",
		author: "Emily Selman",
		avatarSrc:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses--zu-M0NVnqo-unsplash-QLaPxkVlvESa2jcCVIRuI6w7yV4qNW.jpg",
	},
	{
		id: 2,
		rating: 5,
		content: `
      <p>Impressionado com a qualidade destes óculos. A armação é muito bem acabada e as lentes são cristalinas. Ficaram perfeitos no meu rosto e a proteção UV é excelente. Vale cada centavo investido!</p>
    `,
		date: "12 de julho, 2021",
		datetime: "2021-07-12",
		author: "Hector Gibbons",
		avatarSrc:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses--zu-M0NVnqo-unsplash-QLaPxkVlvESa2jcCVIRuI6w7yV4qNW.jpg",
	},
	{
		id: 3,
		rating: 4,
		content: `
      <p>Muito satisfeito com estes óculos. O estilo é moderno e combina com tudo. Única sugestão seria ter mais opções de cores disponíveis. No geral, excelente compra!</p>
    `,
		date: "6 de julho, 2021",
		datetime: "2021-07-06",
		author: "Mark Edwards",
		avatarSrc:
			"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses--zu-M0NVnqo-unsplash-QLaPxkVlvESa2jcCVIRuI6w7yV4qNW.jpg",
	},
];

export default async function ProductPage({
	params,
}: {
	params: Promise<{ productSlug: string }>;
}) {
	const { productSlug } = await params;
	console.log(productSlug);
	return (
		<div className="max-w-7xl mx-auto flex flex-col gap-8 lg:p-4 p-2">
			<section className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-4">
				{/* Product Images Left Scrollable Column */}
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="relative w-full h-96 overflow-hidden">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/glassesshop-7WUyUtVcKSk-unsplash.jpg"
								alt="Product Image"
								fill
								className="object-cover rounded"
								quality={75}
							/>
						</div>
						<div className="relative w-full h-96 overflow-hidden">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/glassesshop-7WUyUtVcKSk-unsplash.jpg"
								alt="Product Image"
								fill
								className="object-cover rounded"
								quality={75}
							/>
						</div>
						<div className="relative w-full h-96 overflow-hidden">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/glassesshop-7WUyUtVcKSk-unsplash.jpg"
								alt="Product Image"
								fill
								className="object-cover rounded"
								quality={75}
							/>
						</div>
						<div className="relative w-full h-96 overflow-hidden">
							<Image
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/glassesshop-7WUyUtVcKSk-unsplash.jpg"
								alt="Product Image"
								fill
								className="object-cover rounded"
								quality={75}
							/>
						</div>
					</div>
					<div className="relative w-full h-[900px] overflow-hidden">
						<Image
							src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/glassesshop-7WUyUtVcKSk-unsplash.jpg"
							alt="Product Image"
							fill
							className="object-cover rounded"
							quality={75}
						/>
					</div>
					<p className="text-md text-foreground text-pretty">
						Esse redondo bold da linha archt mistura presença e elegância,
						incorporando traços de modelos muito queridos pela nossa comunidade.
						A ponte francesa proporciona maior conforto e traz um encaixe mais
						provável para diferentes tipos de narizes, enquanto os pinos
						frontais acrescentam mais uma informação para esse modelo cheio de
						detalhes.
					</p>

					<Carousel className="w-full">
						<CarouselContent className="-ml-4">
							{Array.from({ length: 5 }).map((_, index) => (
								<CarouselItem key={index} className="pl-4 basis-1/3">
									<div className="relative w-full h-80 overflow-hidden">
										<Image
											src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/glassesshop-7WUyUtVcKSk-unsplash.jpg"
											alt={`Product Image ${index + 1}`}
											fill
											className="object-cover rounded"
											quality={75}
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>

					{/* Product FAQ */}
					<div className="flex flex-col gap-2">
						<Accordion type="single" collapsible className="w-full">
							{accordionItems.map((item) => (
								<AccordionItem value={item.id} key={item.id} className="py-2">
									<AccordionPrimitive.Header className="flex">
										<AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
											{item.title}
											<PlusIcon
												size={16}
												className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
												aria-hidden="true"
											/>
										</AccordionPrimitive.Trigger>
									</AccordionPrimitive.Header>
									<AccordionContent className="text-muted-foreground pb-2">
										{item.content}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>

				{/* Product Info Sticky Right Column */}
				<div className="flex flex-col gap-4 bg-muted p-8 rounded h-fit sticky top-14">
					<div className="flex flex-col">
						<div className="flex items-center justify-between gap-4">
							<h2 className="text-lg font-bold">Product Name</h2>
							<strong className="text-lg font-bold">R$100</strong>
						</div>
						<p className="text-sm text-muted-foreground uppercase">
							INCLUI LENTES DE GRAU LEVE
						</p>
					</div>

					{/* Color Variant Picker */}
					<div className="flex flex-col gap-2">
						<Label htmlFor="color-variant-select">Cores da Armação</Label>

						<fieldset aria-label="Escolha uma cor" className="mt-2">
							<div className="flex items-center gap-x-3">
								<ColorVariantPicker
									label="Vermelho"
									value="red"
									colorVariant="black-rose-300"
								/>
								<ColorVariantPicker
									label="Azul"
									value="blue"
									colorVariant="black-blue-300"
								/>
								<ColorVariantPicker
									label="Verde"
									value="green"
									colorVariant="black-green-300"
								/>
							</div>
						</fieldset>
					</div>

					{/* User Actions */}
					<div className="flex flex-col gap-2">
						<Button size="lg" className="w-full" variant="vibrant">
							Escolher lentes e comprar
						</Button>
					</div>
				</div>
			</section>

			{/* Customer Reviews */}
			<section className="flex flex-col gap-4 bg-muted py-16 px-8 rounded">
				<h1 className="text-2xl font-bold mx-auto">Avaliações dos Clientes</h1>

				{customerReviews.map((review, reviewIdx) => (
					<div className="flex flex-col gap-4" key={review.id}>
						<div className="flex space-x-4 text-sm text-muted-foreground">
							<div className="flex-none py-10">
								<div className="relative w-10 h-10 overflow-hidden">
									<Image
										alt="Review Avatar"
										src={review.avatarSrc}
										className="object-cover rounded-full bg-muted"
										fill
										quality={75}
									/>
								</div>
							</div>
							<div
								className={cn(
									reviewIdx === 0 ? "" : "border-t border-muted",
									"flex-1 py-10",
								)}
							>
								<h3 className="font-medium text-foreground">{review.author}</h3>
								<p>
									<time dateTime={review.datetime}>{review.date}</time>
								</p>

								<div className="mt-4 flex items-center">
									{[0, 1, 2, 3, 4].map((rating) => (
										<StarIcon
											key={rating}
											aria-hidden="true"
											className={cn(
												review.rating > rating
													? "text-vibrant"
													: "text-muted-foreground",
												"size-5 shrink-0",
											)}
										/>
									))}
								</div>
								<p className="sr-only">{review.rating} out of 5 stars</p>

								<div
									// biome-ignore lint/security/noDangerouslySetInnerHtml: It's safe
									dangerouslySetInnerHTML={{ __html: review.content }}
									className="mt-4 text-sm/6 text-muted-foreground"
								/>
							</div>
						</div>

						<Carousel className="w-full max-w-5xl mx-auto">
							<CarouselContent className="-ml-4">
								{Array.from({ length: 6 }).map((_, index) => (
									<CarouselItem key={index} className="pl-4 basis-1/3">
										<div className="relative w-full h-80 overflow-hidden">
											<Image
												src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-VUQmxlzP77w-unsplash-2a5LpdMzVDJpmKXrYz8DZhEYCFHxXJ.jpg"
												alt={`Product Image ${index + 1}`}
												fill
												className="object-cover rounded"
												quality={75}
											/>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					</div>
				))}
			</section>
		</div>
	);
}
