import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function CartSummarySkeleton() {
	return (
		<div className="flex flex-col gap-4 bg-muted p-8 rounded h-fit sticky top-14">
			<Skeleton className="h-6 w-32" />

			<div className="flex gap-2 justify-between">
				<Skeleton className="h-5 w-16" />
				<Skeleton className="h-5 w-20" />
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<Skeleton className="h-5 w-12" />
				<Skeleton className="h-5 w-20" />
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<Skeleton className="h-5 w-24" />
				<Skeleton className="h-5 w-20" />
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<Skeleton className="h-5 w-10" />
				<Skeleton className="h-5 w-20" />
			</div>

			<Skeleton className="h-10 w-full" />
		</div>
	);
}
