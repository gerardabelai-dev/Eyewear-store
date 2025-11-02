"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentCustomerQueryOptions } from "@/http";
import { ProfileDisplay } from "./profile-display";

export function ProfileContent() {
	const { data: customer, isPending } = useQuery(
		getCurrentCustomerQueryOptions(),
	);

	if (isPending) {
		return <ProfileSkeleton />;
	}

	if (!customer) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">
					Não foi possível carregar suas informações
				</p>
			</div>
		);
	}

	return (
		<ProfileDisplay
			email={customer.email}
			role={customer.role}
			firstName={customer.firstName}
			lastName={customer.lastName}
			phoneNumber={customer.phoneNumber || ""}
		/>
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
