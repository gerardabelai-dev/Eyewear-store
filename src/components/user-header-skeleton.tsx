import { Skeleton } from "@/components/ui/skeleton";

export function UserHeaderSkeleton() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-14 items-center justify-between">
					{/* Logo and Navigation Skeleton */}
					<div className="flex items-center space-x-4 sm:space-x-8">
						<Skeleton className="h-8 w-32" />

						{/* Desktop Navigation Skeleton */}
						<nav className="hidden md:flex items-center space-x-6">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-16" />
						</nav>
					</div>

					{/* Right side - Mobile menu and User dropdown skeleton */}
					<div className="flex items-center space-x-4">
						{/* Mobile menu button skeleton */}
						<Skeleton className="h-8 w-8 rounded md:hidden" />

						{/* User avatar skeleton */}
						<Skeleton className="h-8 w-8 rounded-full" />
					</div>
				</div>
			</div>
		</header>
	);
}
