import { Skeleton } from "@/components/ui/skeleton";

export function ProductInfoSkeleton() {
	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between gap-4">
				<Skeleton className="h-7 w-48" />
				<Skeleton className="h-6 w-20" />
			</div>
			<Skeleton className="h-4 w-64" />
		</div>
	);
}
