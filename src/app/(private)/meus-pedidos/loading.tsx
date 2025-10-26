import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
			{/* Page Header Skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-96" />
			</div>

			{/* Order Card Skeletons */}
			<div className="flex flex-col gap-6">
				{[1, 2].map((i) => (
					<div key={i} className="border border-muted rounded p-6 space-y-6">
						{/* Order Header Skeleton */}
						<div className="flex gap-8">
							<div className="flex flex-col gap-2">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3 w-16" />
							</div>
							<div className="flex flex-col gap-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-3 w-24" />
							</div>
							<div className="flex flex-col gap-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-3 w-20" />
							</div>
							<div className="flex gap-4 ml-auto my-auto">
								<Skeleton className="h-9 w-24" />
								<Skeleton className="h-9 w-24" />
							</div>
						</div>

						{/* Order Product Skeleton */}
						<div className="flex flex-col gap-4 pt-6 border-t border-muted">
							<div className="flex gap-8">
								<Skeleton className="size-48 md:size-32 aspect-square rounded" />
								<div className="flex flex-col gap-4 w-full">
									<div className="flex gap-4 justify-between">
										<Skeleton className="h-5 w-40" />
										<Skeleton className="h-5 w-24" />
									</div>
									<Skeleton className="h-16 w-full" />
								</div>
							</div>
							<div className="flex gap-8 justify-between">
								<Skeleton className="h-6 w-48" />
								<div className="flex gap-2">
									<Skeleton className="h-8 w-24" />
									<Skeleton className="h-8 w-32" />
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
