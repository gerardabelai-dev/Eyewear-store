import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
	userImage?: string | null;
	userInitials: string;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeClasses = {
	sm: "w-8 h-8 text-sm",
	md: "w-10 h-10 text-sm",
	lg: "w-16 h-16 text-lg",
	xl: "w-20 h-20 text-lg",
};

export function UserAvatar({
	userImage,
	userInitials,
	size = "md",
	className,
}: UserAvatarProps) {
	const sizeClass = sizeClasses[size];

	return (
		<div
			className={cn(
				"rounded-full overflow-hidden flex items-center justify-center",
				sizeClass,
				userImage
					? "bg-background"
					: "bg-gradient-to-r from-purple-400 to-blue-400",
				className,
			)}
		>
			{userImage ? (
				<Image
					src={userImage}
					alt="Avatar"
					width={
						size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 64 : 80
					}
					height={
						size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 64 : 80
					}
					className="w-full h-full object-cover"
				/>
			) : (
				<span
					className={cn(
						"font-semibold text-white",
						size === "sm" ? "text-sm" : "text-sm",
					)}
				>
					{userInitials}
				</span>
			)}
		</div>
	);
}
