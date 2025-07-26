import { Skeleton } from "@/components/ui/skeleton";

export function UserHeaderSkeleton() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				{/* Logo and navigation skeleton */}
				<div className="flex items-center gap-6">
					<Skeleton className="h-8 w-32" />
					<nav className="hidden md:flex items-center gap-6">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-16" />
					</nav>
				</div>

				{/* User menu skeleton */}
				<div className="flex items-center gap-4">
					<Skeleton className="h-9 w-9 rounded-full" />
				</div>
			</div>
		</header>
	);
}
