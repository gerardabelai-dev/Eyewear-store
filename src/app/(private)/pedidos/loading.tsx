import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
			<div className="mb-6 sm:mb-8">
				<Skeleton className="h-8 w-64" />
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
			</div>
			<Skeleton className="h-96 w-full" />
		</div>
	);
}
