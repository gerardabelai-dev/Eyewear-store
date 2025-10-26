"use client";

import { Cog, LogOut, Menu, Repeat, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { AppLogo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserAvatar } from "@/components/ui/user-avatar";
import { ROUTES } from "@/constants/routes";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useModeStore } from "@/stores/mode-store";

interface PrivateHeaderNavigationProps {
	user: {
		image?: string | null;
		name?: string | null;
		email?: string | null;
		role?: string | null;
	};
}

const privateNavigationItems = [
	{ name: "Minha Conta", href: ROUTES.CUSTOMER_PROFILE },
	{ name: "Meus pedidos", href: ROUTES.CUSTOMER_ORDERS },
];

const adminNavigationItems = [
	{ name: "Produtos", href: ROUTES.ADMIN_PRODUCTS },
	{ name: "Categorias", href: ROUTES.ADMIN_CATEGORIES },
	{ name: "Pedidos", href: ROUTES.ADMIN_ORDERS },
	{ name: "Clientes", href: ROUTES.ADMIN_CUSTOMERS },
	{ name: "Atividades", href: ROUTES.ADMIN_ACTIVITIES },
];

export function PrivateHeaderNavigation({
	user,
}: PrivateHeaderNavigationProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { mode, setMode, resetToCustomer } = useModeStore();

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userName = user.name || "User";
	const userEmail = user.email || "";
	const userImage = user.image || null;
	const userRole = user.role || "user";
	const userInitials = getInitials(userName);
	const isAdmin = userRole === "admin";

	// Reset mode to customer if user is not admin
	// This ensures regular users can't access admin mode even if it's stored in localStorage
	React.useEffect(() => {
		if (!isAdmin && mode === "admin") {
			resetToCustomer();
		}
	}, [isAdmin, mode, resetToCustomer]);

	const handleSignOut = async () => {
		// Reset mode to customer when signing out to prevent mode persistence across different users
		resetToCustomer();
		await authClient.signOut();
		router.push(ROUTES.SIGN_IN);
	};

	const handleModeSwitch = (newMode: "customer" | "admin") => {
		// Only allow admin mode if user is actually an admin
		if (newMode === "admin" && !isAdmin) {
			return;
		}
		setMode(newMode);
		// Navigate to appropriate home route based on mode
		if (newMode === "admin") {
			router.push(ROUTES.ADMIN_PRODUCTS);
		} else {
			router.push(ROUTES.CUSTOMER_PROFILE);
		}
	};

	// Get navigation items based on current mode, but only allow admin navigation if user is admin
	const effectiveMode = isAdmin ? mode : "customer";
	const currentNavigationItems =
		effectiveMode === "admin" ? adminNavigationItems : privateNavigationItems;

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-7xl mx-auto px-4 xl:px-0">
				<div className="flex h-14 items-center justify-between">
					{/* Logo and Navigation */}
					<div className="flex items-center space-x-4 sm:space-x-8">
						<Link href="/" className="w-28">
							<AppLogo showText={true} />
						</Link>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center space-x-6">
							{currentNavigationItems.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"text-sm font-medium transition-colors hover:text-primary",
										pathname === item.href
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									{item.name}
								</Link>
							))}
						</nav>
					</div>

					{/* Right side - Mobile menu and User dropdown */}
					<div className="flex items-center space-x-4">
						{/* Mobile Navigation */}
						<Sheet>
							<SheetTrigger asChild className="md:hidden">
								<Button variant="ghost" size="icon">
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-[240px] sm:w-[280px]">
								<div className="mb-6">
									<Link href="/" className="w-28">
										<AppLogo showText={true} />
									</Link>
								</div>
								<nav className="flex flex-col space-y-3">
									{currentNavigationItems.map((item) => (
										<Link
											key={item.name}
											href={item.href}
											className={cn(
												"text-sm font-medium transition-colors hover:text-primary",
												pathname === item.href
													? "text-foreground"
													: "text-muted-foreground",
											)}
										>
											{item.name}
										</Link>
									))}
								</nav>
							</SheetContent>
						</Sheet>

						{/* User Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<UserAvatar
										userImage={userImage}
										userInitials={userInitials}
										size="sm"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{userName}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{userEmail}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{isAdmin && (
									<>
										<DropdownMenuSub>
											<DropdownMenuSubTrigger>
												<Repeat className="mr-2 h-4 w-4" />
												<span>Gerenciar</span>
											</DropdownMenuSubTrigger>
											<DropdownMenuPortal>
												<DropdownMenuSubContent>
													<DropdownMenuItem
														onClick={() => handleModeSwitch("admin")}
														className={cn(
															"cursor-pointer",
															mode === "admin" && "bg-primary",
														)}
													>
														<Cog className="mr-2 h-4 w-4" />
														<span>Ver como Admin</span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleModeSwitch("customer")}
														className={cn(
															"cursor-pointer",
															mode === "customer" && "bg-primary",
														)}
													>
														<ShoppingCart className="mr-2 h-4 w-4" />
														<span>Ver como Cliente</span>
													</DropdownMenuItem>
												</DropdownMenuSubContent>
											</DropdownMenuPortal>
										</DropdownMenuSub>
										<DropdownMenuSeparator />
									</>
								)}
								<DropdownMenuItem asChild>
									<Link
										href={ROUTES.CUSTOMER_PROFILE}
										className="cursor-pointer"
									>
										<User className="mr-2 h-4 w-4" />
										<span>Minha conta</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleSignOut}
									className="cursor-pointer"
								>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Sair</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
	);
}
