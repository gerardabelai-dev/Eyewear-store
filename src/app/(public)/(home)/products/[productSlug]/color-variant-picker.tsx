import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ColorVariantPickerProps {
	label: string;
	value: string;
	colorVariant: string;
}

export function ColorVariantPicker({
	label,
	value,
	colorVariant,
}: ColorVariantPickerProps) {
	function getVariantColor(colorVariant: string) {
		const colorVariants: Record<string, string> = {
			"black-rose-300": "bg-gradient-to-r from-black to-rose-300",
			"black-blue-300": "bg-gradient-to-r from-black to-blue-300",
			"black-green-300": "bg-gradient-to-r from-black to-green-300",
		};

		return colorVariants[colorVariant] || "bg-gray-400";
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						key={value}
						className="flex rounded-full outline -outline-offset-1 outline-black/10"
					>
						<input
							defaultValue={value}
							defaultChecked={true}
							name="color"
							type="radio"
							aria-label={label}
							className={cn(
								getVariantColor(colorVariant),
								"cursor-pointer size-8 appearance-none rounded-full forced-color-adjust-none checked:outline-2 checked:outline-primary checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3",
							)}
						/>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
