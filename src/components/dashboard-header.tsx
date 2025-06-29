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
import { signOut } from "@/lib/auth-client";

interface DashboardHeaderProps {
	userInitials: string;
	userName: string;
	userEmail: string;
}

export function DashboardHeader({
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
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center space-x-8">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<Shield className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold">DrVista Admin</span>
						</div>
						<nav className="hidden md:flex items-center space-x-6">
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
					<div className="flex items-center space-x-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input placeholder="Buscar" className="pl-10 w-64" />
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
								>
									<div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
										<span className="text-white text-sm font-semibold">
											{userInitials}
										</span>
									</div>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end">
								<DropdownMenuLabel>
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium">{userName}</p>
										<p className="text-xs text-muted-foreground">{userEmail}</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									Configurações
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-red-600 focus:text-red-600"
									onClick={handleSignOut}
								>
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
