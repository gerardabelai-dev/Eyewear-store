import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivitiesHistory } from "./activities-history";

// Force dynamic rendering for this page since it shows real-time activity data
export const dynamic = "force-dynamic";

export default function ActivitiesPage() {
	return (
		<>
			{/* Page Header - Renders immediately */}
			<PageHeader
				title="Atividades"
				description="Gerencie as atividades do sistema"
			/>

			{/* Activities History - Stream with Suspense */}
			<Suspense fallback={<Skeleton className="h-96 w-full" />}>
				<ActivitiesHistory />
			</Suspense>
		</>
	);
}
