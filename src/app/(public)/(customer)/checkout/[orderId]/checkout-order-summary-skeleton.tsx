import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutOrderSummarySkeleton() {
	return (
		<div className="flex flex-col gap-4 bg-muted p-8 rounded h-fit sticky top-14">
			<h2 className="text-lg font-bold">Resumo do pedido</h2>

			<div className="flex gap-2 justify-between">
				<Skeleton className="h-5 w-16 bg-muted-foreground/20" />
				<Skeleton className="h-5 w-20 bg-muted-foreground/20" />
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<Skeleton className="h-5 w-12 bg-muted-foreground/20" />
				<Skeleton className="h-5 w-20 bg-muted-foreground/20" />
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<Skeleton className="h-5 w-24 bg-muted-foreground/20" />
				<Skeleton className="h-5 w-20 bg-muted-foreground/20" />
			</div>

			<Separator />

			<div className="flex gap-2 justify-between">
				<Skeleton className="h-5 w-10 bg-muted-foreground/20" />
				<Skeleton className="h-5 w-20 bg-muted-foreground/20" />
			</div>

			<Separator />

			{/* Coupon form skeleton */}
			<div className="flex flex-col gap-2">
				<Skeleton className="h-5 w-24 bg-muted-foreground/20" />
				<div className="flex gap-2">
					<Skeleton className="h-10 flex-1 bg-muted-foreground/20" />
					<Skeleton className="h-10 w-20 bg-muted-foreground/20" />
				</div>
			</div>

			<Skeleton className="h-10 w-full bg-muted-foreground/20" />
		</div>
	);
}
