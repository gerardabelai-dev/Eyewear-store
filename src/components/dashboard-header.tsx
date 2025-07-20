"use client";

import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppLogo } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserAvatar } from "@/components/ui/user-avatar";
import { signOut } from "@/lib/auth-client";

interface DashboardHeaderProps {
	userImage?: string | null;
	userInitials: string;
	userName: string;
	userEmail: string;
}

const navigationItems = [
	{ name: "Produtos", href: "/produtos" },
	{ name: "Pedidos", href: "/pedidos" },
	{ name: "Clientes", href: "#" },
];

export function DashboardHeader({
	userImage,
	userInitials,
	userName,
	userEmail,
}: DashboardHeaderProps) {
	const router = useRouter();
	const pathname = usePathname();

	const handleSignOut = async () => {
		try {
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push("/auth");
					},
				},
			});
		} catch (error) {
			console.error("Sign out error:", error);
		}
	};

	const isActivePath = (href: string) => {
		if (href === "/dashboard") {
			return pathname === "/dashboard";
		}
		return pathname.startsWith(href) && href !== "#";
	};

	return (
		<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-14 sm:h-16">
					<div className="flex items-center space-x-4 sm:space-x-8 min-w-0">
						<Link
							href="/dashboard"
							className="flex items-center space-x-2 shrink-0"
						>
							<AppLogo size="md" showText={true} />
						</Link>
						<nav className="hidden lg:flex items-center space-x-6">
							{navigationItems.map((item) => {
								const isActive = isActivePath(item.href);
								const isDisabled = item.href === "#";

								if (isDisabled) {
									return (
										<Button
											key={item.name}
											variant="ghost"
											className="text-muted-foreground cursor-not-allowed opacity-50"
											disabled
										>
											{item.name}
										</Button>
									);
								}

								return (
									<Link key={item.name} href={item.href}>
										<Button
											variant="ghost"
											className={
												isActive ? "text-foreground" : "text-muted-foreground"
											}
										>
											{item.name}
										</Button>
									</Link>
								);
							})}
							<Link href="/dashboard">
								<Button
									variant="ghost"
									className={
										isActivePath("/dashboard")
											? "text-foreground"
											: "text-muted-foreground"
									}
								>
									Configurações
								</Button>
							</Link>
						</nav>
					</div>
					<div className="flex items-center space-x-2 sm:space-x-4">
						{/* Theme Toggle */}
						<ThemeToggle />

						{/* User Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 rounded-lg hover:bg-muted/50"
								>
									<UserAvatar
										userImage={userImage}
										userInitials={userInitials}
										size="sm"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end">
								<DropdownMenuLabel>
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium truncate">{userName}</p>
										<p className="text-xs text-muted-foreground truncate">
											{userEmail}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />

								{/* Mobile navigation items */}
								<div className="lg:hidden">
									{navigationItems.map((item) => {
										if (item.href === "#") {
											return (
												<DropdownMenuItem key={item.name} disabled>
													{item.name}
												</DropdownMenuItem>
											);
										}
										return (
											<Link key={item.name} href={item.href}>
												<DropdownMenuItem>{item.name}</DropdownMenuItem>
											</Link>
										);
									})}
									<DropdownMenuSeparator />
								</div>

								<Link href="/dashboard">
									<DropdownMenuItem>
										<Settings className="mr-2 h-4 w-4" />
										Configurações
									</DropdownMenuItem>
								</Link>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleSignOut}>
									<LogOut className="mr-2 h-4 w-4" />
									Sair
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
	);
}
