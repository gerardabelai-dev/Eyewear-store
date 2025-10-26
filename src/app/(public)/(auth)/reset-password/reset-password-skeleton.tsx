import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResetPasswordSkeleton() {
	return (
		<div className="w-full max-w-md mx-auto space-y-6">
			<div className="space-y-2 text-center">
				<Skeleton className="h-8 w-48 mx-auto" />
				<Skeleton className="h-4 w-64 mx-auto" />
			</div>

			<Card>
				<CardContent className="pt-6">
					<div className="space-y-4">
						{/* Name field */}
						<div className="space-y-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="w-full h-10" />
						</div>

						{/* Email field */}
						<div className="space-y-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="w-full h-10" />
						</div>

						{/* Password field */}
						<div className="space-y-2">
							<Skeleton className="h-4 w-12" />
							<Skeleton className="w-full h-10" />
						</div>

						{/* Confirm password field */}
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="w-full h-10" />
						</div>

						{/* Submit button */}
						<Skeleton className="w-full h-10" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
