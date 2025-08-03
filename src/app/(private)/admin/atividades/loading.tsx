import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<>
			{/* Page Header */}
			<div className="mb-6">
				<Skeleton className="h-8 w-32 mb-2" />
				<Skeleton className="h-4 w-64" />
			</div>

			{/* Activities Timeline Card */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Skeleton className="h-5 w-5" />
						<Skeleton className="h-6 w-40" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="relative space-y-4">
						{/* Timeline line */}
						<div className="absolute left-4 top-0 h-full w-px bg-border" />

						{/* Timeline items */}
						{Array.from({ length: 5 }).map((_, index) => (
							<div
								key={index}
								className="relative flex items-center gap-3 py-2.5"
							>
								{/* Activity icon */}
								<Skeleton className="h-8 w-8 rounded-full" />

								{/* Content */}
								<div className="flex flex-1 items-center justify-between">
									<div className="flex items-center gap-3">
										{/* User avatar */}
										<Skeleton className="h-6 w-6 rounded-full" />

										{/* Activity text */}
										<div className="flex items-center gap-2">
											<Skeleton className="h-4 w-20" />
											<Skeleton className="h-4 w-32" />
										</div>
									</div>

									{/* Time badge */}
									<Skeleton className="h-5 w-16 rounded-full" />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</>
	);
}
