import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
	userImage?: string | null;
	userInitials: string;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeClasses = {
	sm: "w-8 h-8 text-xs",
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
		<Avatar className={cn(sizeClass, className)}>
			{userImage && <AvatarImage src={userImage} alt="Avatar" />}
			<AvatarFallback className="bg-primary text-primary-foreground font-semibold drop-shadow-sm">
				{userInitials}
			</AvatarFallback>
		</Avatar>
	);
}
