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
	colors: string[];
}

export function ColorVariantPicker({
	label,
	value,
	colors,
}: ColorVariantPickerProps) {
	function getVariantColor(colors: string[]) {
		if (colors.length > 1) {
			return `bg-gradient-to-r from-${colors[0]} to-${colors[1]}`;
		}
		return `bg-${colors[0]}`;
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
								getVariantColor(colors),
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
