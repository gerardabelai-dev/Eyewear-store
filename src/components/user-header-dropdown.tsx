"use client";

import { LogOut, Package, User } from "lucide-react";
import Link from "next/link";
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
import { UserAvatar } from "@/components/ui/user-avatar";
import { ROUTES } from "@/constants/routes";
import { authClient } from "@/lib/auth-client";

interface UserHeaderDropdownProps {
	user: {
		image?: string | null;
		name?: string | null;
		email?: string | null;
	};
}

export function UserHeaderDropdown({ user }: UserHeaderDropdownProps) {
	const router = useRouter();

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
	const userInitials = getInitials(userName);

	const handleSignOut = async () => {
		await authClient.signOut();
		router.push(ROUTES.SIGN_IN);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
						<p className="text-sm font-medium leading-none">{userName}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{userEmail}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href={ROUTES.CUSTOMER_PROFILE} className="cursor-pointer">
						<User className="mr-2 h-4 w-4" />
						<span>Minha conta</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href={ROUTES.CUSTOMER_ORDERS} className="cursor-pointer">
						<Package className="mr-2 h-4 w-4" />
						<span>Meus pedidos</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
					<LogOut className="mr-2 h-4 w-4" />
					<span>Sair</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
