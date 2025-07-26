import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductsStatisticsSkeleton() {
	const statCards = [
		"total-products",
		"active-products",
		"low-stock",
		"stock-value",
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{statCards.map((statName) => (
				<Card key={statName}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-4 rounded" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-8 w-20 mb-2" />
						<Skeleton className="h-3 w-28" />
					</CardContent>
				</Card>
			))}
		</div>
	);
}
