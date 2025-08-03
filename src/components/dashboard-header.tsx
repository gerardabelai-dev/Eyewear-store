"use client";

import { Cog, LogOut, Menu, Repeat, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

interface DashboardHeaderProps {
	user: {
		image: string | null;
		initials: string;
		name: string;
		email: string;
		role: string;
	};
}

const getNavigationItems = (role: string) => {
	if (role === "admin") {
		return [
			{ name: "Produtos", href: ROUTES.ADMIN_PRODUCTS },
			{ name: "Categorias", href: ROUTES.ADMIN_CATEGORIES },
			{ name: "Pedidos", href: ROUTES.ADMIN_ORDERS },
			{ name: "Clientes", href: "#" },
		];
	} else {
		return [{ name: "Perfil", href: ROUTES.CUSTOMER_PROFILE }];
	}
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
	const pathname = usePathname();
	const router = useRouter();
	const navigationItems = getNavigationItems(user.role);

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userInitials = getInitials(user.name || "User");

	const handleSignOut = async () => {
		await authClient.signOut();
		router.push(ROUTES.SIGN_IN);
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-14 items-center justify-between">
					{/* Logo and Navigation */}
					<div className="flex items-center space-x-4 sm:space-x-8">
						<Link href="/" className="flex items-center space-x-2">
							<AppLogo showText={true} />
						</Link>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center space-x-6">
							{navigationItems.map((item) => (
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
									<Link href="/" onClick={() => document.body.click()}>
										<AppLogo showText={true} />
									</Link>
								</div>
								<nav className="flex flex-col space-y-3">
									{navigationItems.map((item) => (
										<Link
											key={item.name}
											href={item.href}
											onClick={() => document.body.click()}
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
										userImage={user.image}
										userInitials={userInitials}
										size="sm"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user.name}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{user.role === "admin" && (
									<DropdownMenuSub>
										<DropdownMenuSubTrigger>
											<Repeat className="mr-2 h-4 w-4" />
											<span>Gerenciar</span>
										</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent>
												<DropdownMenuItem asChild>
													<Link href={ROUTES.ADMIN_PRODUCTS}>
														<Cog className="mr-2 h-4 w-4" />
														<span>Modo Administrador</span>
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href={ROUTES.CUSTOMER_PROFILE}>
														<ShoppingCart className="mr-2 h-4 w-4" />
														<span>Modo Cliente</span>
													</Link>
												</DropdownMenuItem>
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
								)}
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link
										href={ROUTES.CUSTOMER_PROFILE}
										className="cursor-pointer"
									>
										<User className="mr-2 h-4 w-4" />
										<span>Perfil</span>
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
