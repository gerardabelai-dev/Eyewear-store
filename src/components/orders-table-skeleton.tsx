import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersTableSkeleton() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Pedidos Registrados</CardTitle>
				<CardDescription>
					<span className="inline-block h-4 w-48 animate-pulse rounded-md bg-muted" />
				</CardDescription>
			</CardHeader>
			<CardContent>
				{/* Tabs skeleton */}
				<div className="mb-4">
					<Skeleton className="h-10 w-full max-w-md" />
				</div>

				{/* Table skeleton */}
				<div className="rounded-md border">
					<div className="p-4">
						{/* Table header */}
						<div className="flex items-center gap-4 pb-4 border-b">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-16" />
						</div>

						{/* Table rows */}
						{["row-1", "row-2", "row-3", "row-4", "row-5"].map((rowId) => (
							<div
								key={rowId}
								className="flex items-center gap-4 py-4 border-b last:border-0"
							>
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-36" />
								<Skeleton className="h-6 w-24 rounded-full" />
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-8 w-8 rounded" />
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
