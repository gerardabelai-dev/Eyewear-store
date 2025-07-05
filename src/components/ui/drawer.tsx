import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

interface DrawerProps {
	trigger: ReactNode;
	title: string;
	description?: string;
	icon?: ReactNode;
	children: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
}

interface DrawerControlledProps {
	trigger: ReactNode;
	title: string;
	description?: string;
	icon?: ReactNode;
	children: (props: { onClose: () => void }) => ReactNode;
	className?: string;
}

export function Drawer({
	trigger,
	title,
	description,
	icon,
	children,
	open,
	onOpenChange,
	className = "w-full sm:max-w-2xl overflow-y-auto",
}: DrawerProps) {
	const [internalOpen, setInternalOpen] = useState(false);

	const isControlled = open !== undefined;
	const currentOpen = isControlled ? open : internalOpen;
	const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

	return (
		<Sheet open={currentOpen} onOpenChange={setOpen}>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent className={className}>
				<div className="p-6">
					<SheetHeader>
						<SheetTitle className="flex items-center gap-2">
							{icon && icon}
							{title}
						</SheetTitle>
						{description && <SheetDescription>{description}</SheetDescription>}
					</SheetHeader>
					<div className="mt-6">{children}</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

export function DrawerControlled({
	trigger,
	title,
	description,
	icon,
	children,
	className = "w-full sm:max-w-2xl overflow-y-auto",
}: DrawerControlledProps) {
	const [open, setOpen] = useState(false);

	const onClose = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent className={className}>
				<div className="p-6">
					<SheetHeader>
						<SheetTitle className="flex items-center gap-2">
							{icon && icon}
							{title}
						</SheetTitle>
						{description && <SheetDescription>{description}</SheetDescription>}
					</SheetHeader>
					<div className="mt-6">{children({ onClose })}</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

export {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
