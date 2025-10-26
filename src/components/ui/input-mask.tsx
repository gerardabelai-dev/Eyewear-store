"use client";

import * as React from "react";
import type { Options } from "use-mask-input";
import { withMask } from "use-mask-input";
import { cn } from "@/lib/utils";

export interface InputMaskProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	mask: string | string[];
	maskOptions?: Options;
}

const InputMask = React.forwardRef<HTMLInputElement, InputMaskProps>(
	({ className, type, mask, maskOptions, ...props }, ref) => {
		const inputRef = React.useRef<HTMLInputElement | null>(null);

		// Combine refs: both the forwarded ref and our internal ref
		const setRefs = React.useCallback(
			(element: HTMLInputElement | null) => {
				inputRef.current = element;

				// Handle forwarded ref (from react-hook-form)
				if (typeof ref === "function") {
					ref(element);
				} else if (ref) {
					ref.current = element;
				}

				// Apply mask
				if (element) {
					withMask(mask, maskOptions)(element);
				}
			},
			[mask, maskOptions, ref],
		);

		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={setRefs}
				{...props}
			/>
		);
	},
);
InputMask.displayName = "InputMask";

export { InputMask };
