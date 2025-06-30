"use client";

import { LogOut, Search, Settings, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/user-avatar";
import { signOut } from "@/lib/auth-client";

interface DashboardHeaderProps {
	userImage?: string | null;
	userInitials: string;
	userName: string;
	userEmail: string;
}

export function DashboardHeader({
	userImage,
	userInitials,
	userName,
	userEmail,
}: DashboardHeaderProps) {
	const router = useRouter();

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

	return (
		<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-14 sm:h-16">
					<div className="flex items-center space-x-4 sm:space-x-8 min-w-0">
						<div className="flex items-center space-x-2 shrink-0">
							<div
								className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm`}
							>
								<Shield className="w-3 h-3 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
							</div>
							<span className="text-lg sm:text-xl font-bold truncate">
								DrVista Admin
							</span>
						</div>
						<nav className="hidden lg:flex items-center space-x-6">
							<Button variant="ghost" className="text-muted-foreground">
								Dashboard
							</Button>
							<Button variant="ghost" className="text-muted-foreground">
								Pedidos
							</Button>
							<Button variant="ghost" className="text-muted-foreground">
								Produtos
							</Button>
							<Button variant="ghost" className="text-muted-foreground">
								Clientes
							</Button>
							<Button variant="outline" className="bg-muted text-foreground">
								Configurações
							</Button>
						</nav>
					</div>
					<div className="flex items-center space-x-2 sm:space-x-4">
						{/* Search - Responsive width */}
						<div className="relative hidden sm:block">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input
								placeholder="Buscar"
								className="pl-10 w-32 md:w-48 lg:w-64"
							/>
						</div>

						{/* Mobile Search Button */}
						<Button variant="ghost" size="sm" className="sm:hidden p-2">
							<Search className="w-4 h-4" />
						</Button>

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
									<DropdownMenuItem>Dashboard</DropdownMenuItem>
									<DropdownMenuItem>Pedidos</DropdownMenuItem>
									<DropdownMenuItem>Produtos</DropdownMenuItem>
									<DropdownMenuItem>Clientes</DropdownMenuItem>
									<DropdownMenuSeparator />
								</div>

								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									Configurações
								</DropdownMenuItem>
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
