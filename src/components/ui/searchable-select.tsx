"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SearchableSelectOption {
	value: string;
	label: string;
	[key: string]: any;
}

interface SearchableSelectProps {
	options: SearchableSelectOption[];
	value?: string;
	onValueChange: (value: string) => void;
	placeholder?: string;
	label?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	addNewText?: string;
	onAddNew?: () => void;
	showAddNew?: boolean;
	disabled?: boolean;
	className?: string;
	loading?: boolean;
	loadingText?: string;
}

export function SearchableSelect({
	options,
	value,
	onValueChange,
	placeholder = "Select option",
	label,
	searchPlaceholder = "Search...",
	emptyText = "No options found.",
	addNewText = "Add new",
	onAddNew,
	showAddNew = false,
	disabled = false,
	className,
	loading = false,
	loadingText = "Loading...",
}: SearchableSelectProps) {
	const id = useId();
	const [open, setOpen] = useState<boolean>(false);

	const selectedOption = options.find((option) => option.value === value);

	return (
		<div className={cn("space-y-2", className)}>
			{label && <Label htmlFor={id}>{label}</Label>}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id={id}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						disabled={disabled}
						className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
					>
						<span className={cn("truncate", !value && "text-muted-foreground")}>
							{loading ? loadingText : selectedOption?.label || placeholder}
						</span>
						<ChevronDownIcon
							size={16}
							className="text-muted-foreground/80 shrink-0"
							aria-hidden="true"
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
					align="start"
				>
					<Command>
						<CommandInput placeholder={searchPlaceholder} />
						<CommandList>
							<CommandEmpty>{emptyText}</CommandEmpty>
							{options.length > 0 && (
								<CommandGroup>
									{options.map((option) => (
										<CommandItem
											key={option.value}
											value={option.value}
											onSelect={(currentValue) => {
												onValueChange(
													currentValue === value ? "" : currentValue,
												);
												setOpen(false);
											}}
										>
											{option.label}
											{value === option.value && (
												<CheckIcon size={16} className="ml-auto" />
											)}
										</CommandItem>
									))}
								</CommandGroup>
							)}
							{showAddNew && onAddNew && (
								<>
									<CommandSeparator />
									<CommandGroup>
										<CommandItem
											className="cursor-pointer"
											onSelect={() => {
												setOpen(false);
												onAddNew();
											}}
										>
											<PlusIcon
												size={16}
												className="mr-2 opacity-60"
												aria-hidden="true"
											/>
											{addNewText}
										</CommandItem>
									</CommandGroup>
								</>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
