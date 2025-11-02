"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { AuthButtons } from "./auth-buttons";
import { AppLogo } from "./brand";
import { CartButton } from "./cart-button";
import { UserHeaderDropdown } from "./user-header-dropdown";

export function Header() {
	const { data: session, isPending } = useSession();

	return (
		<header className="md:px-0 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-7xl mx-auto px-4 md:px-6">
				<div className="flex h-14 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="w-28">
						<AppLogo showText={true} />
					</Link>

					{/* Right side - Cart and User/Auth section */}
					<div className="flex items-center gap-4">
						{/* Cart Button - always visible */}
						<Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
							<CartButton />
						</Suspense>

						{/* User section - dynamic based on auth state */}
						{isPending ? (
							<Skeleton className="h-8 w-8 rounded-full" />
						) : session?.user ? (
							<UserHeaderDropdown user={session.user} />
						) : (
							<AuthButtons />
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
