import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function CartSummarySkeleton() {
	return (
		<div className="flex flex-col gap-4 bg-muted p-8 rounded h-fit sticky top-14">
			<Skeleton className="h-6 w-32 bg-muted-foreground/20" />

			<div className="flex gap-2 justify-between">
				<Skeleton className="h-5 w-16 bg-muted-foreground/20" />
				<Skeleton className="h-5 w-20 bg-muted-foreground/20" />
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<div className="flex items-center gap-1">
					<Skeleton className="h-5 w-12 bg-muted-foreground/20" />
					<Skeleton className="size-4 rounded-full bg-muted-foreground/20" />
				</div>
				<Skeleton className="h-5 w-20 bg-muted-foreground/20" />
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<div className="flex items-center gap-1">
					<Skeleton className="h-5 w-24 bg-muted-foreground/20" />
					<Skeleton className="size-4 rounded-full bg-muted-foreground/20" />
				</div>
				<Skeleton className="h-5 w-20 bg-muted-foreground/20" />
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<Skeleton className="h-5 w-10 bg-muted-foreground/20" />
				<Skeleton className="h-5 w-20 bg-muted-foreground/20" />
			</div>

			<Skeleton className="h-10 w-full bg-muted-foreground/20" />
		</div>
	);
}
