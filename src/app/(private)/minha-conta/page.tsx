import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentCustomerQueryOptions } from "@/http";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { ProfileContent } from "./profile-content";

export default async function MyAccountPage() {
	const queryClient = getQueryClient();

	// Prefetch customer data for React Query cache
	void queryClient.prefetchQuery(getCurrentCustomerQueryOptions());

	return (
		<div className="mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
			<PageHeader
				title="Minha conta"
				description="Gerencie suas informações de perfil e configurações"
			/>

			<div className="flex flex-col gap-6">
				{/* Main Content */}
				<div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
					{/* Profile Information Display */}
					<Suspense fallback={<ProfileSkeleton />}>
						<ProfileContent />
					</Suspense>
				</div>
			</div>
		</div>
	);
}

function ProfileSkeleton() {
	return (
		<div className="border rounded-lg p-6 space-y-6">
			<div className="flex justify-between items-start">
				<div className="space-y-2 w-full max-w-md">
					<div className="flex justify-between items-center gap-4">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-5 w-16" />
					</div>
					<Skeleton className="h-4 w-64" />
					<div className="my-4">
						<Skeleton className="h-[1px] w-full" />
					</div>
					<div className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-48" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-56" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-40" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
