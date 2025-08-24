import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function CartItemSkeleton() {
	return (
		<li className="flex gap-4">
			{/* Product Image Skeleton */}
			<div className="relative w-48 md:w-96 h-full aspect-video">
				<Skeleton className="w-full h-full rounded" />
			</div>

			{/* Product Details Skeleton */}
			<div className="flex flex-col justify-between gap-2">
				<div className="flex flex-col gap-2">
					{/* Product Name */}
					<Skeleton className="h-7 w-48" />

					{/* Product Description */}
					<Skeleton className="h-4 w-64" />

					{/* Price Section */}
					<div className="flex items-center gap-2">
						<Skeleton className="h-6 w-20" />
						<Skeleton className="h-4 w-16" />
					</div>
				</div>

				{/* Mobile Quantity and Delete Button */}
				<div className="flex md:hidden gap-2 items-center">
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-10" />
				</div>

				{/* Stock Status */}
				<div className="flex items-center gap-2">
					<Skeleton className="size-4 rounded-full" />
					<Skeleton className="h-4 w-20" />
				</div>
			</div>

			{/* Desktop Quantity Selector */}
			<div className="ml-auto hidden md:flex items-center gap-2">
				<Skeleton className="h-10 w-24" />
			</div>

			{/* Desktop Delete Button */}
			<Skeleton className="hidden md:block h-10 w-10" />
		</li>
	);
}

export function CartItemsSkeleton() {
	return (
		<ul className="flex flex-col gap-4">
			{Array.from({ length: 3 }).map((_, index) => (
				<div key={index}>
					<CartItemSkeleton />
					{index < 2 && <Separator className="my-6" />}
				</div>
			))}
		</ul>
	);
}
