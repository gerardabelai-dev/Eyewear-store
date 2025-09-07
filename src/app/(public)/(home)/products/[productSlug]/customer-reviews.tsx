import { StarIcon } from "lucide-react";
import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface CustomerReview {
	id: number;
	rating: number;
	content: string;
	date: string;
	datetime: string;
	author: string;
	avatarSrc: string;
}

interface CustomerReviewsProps {
	reviews: CustomerReview[];
}

export function CustomerReviews({ reviews }: CustomerReviewsProps) {
	return (
		<section className="flex flex-col gap-4 bg-muted py-16 px-8 rounded">
			<h1 className="text-2xl font-bold mx-auto">Avaliações dos Clientes</h1>

			{reviews.map((review, reviewIdx) => (
				<div className="flex flex-col gap-4" key={review.id}>
					<div className="flex space-x-4 text-sm text-muted-foreground">
						<div className="flex-none py-10">
							<div className="relative w-10 h-10 overflow-hidden">
								<Image
									alt="Review Avatar"
									src={review.avatarSrc}
									className="object-cover rounded-full bg-muted"
									fill
									sizes="40px"
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

					<Carousel className="w-full max-w-3xs md:max-w-5xl mx-auto">
						<CarouselContent className="lg:-ml-4">
							{Array.from({ length: 6 }).map((_, index) => (
								<CarouselItem key={index} className="lg:pl-4 lg:basis-1/3">
									<div className="relative w-full h-80 overflow-hidden">
										<Image
											src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/reviews/zeelool-glasses-VUQmxlzP77w-unsplash-2a5LpdMzVDJpmKXrYz8DZhEYCFHxXJ.jpg"
											alt={`Product Image ${index + 1}`}
											fill
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
	);
}
