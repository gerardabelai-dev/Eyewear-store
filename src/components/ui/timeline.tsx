import React from "react";
import { cn } from "@/lib/utils";

interface TimelineProps {
	children: React.ReactNode;
	className?: string;
}

interface TimelineItemProps {
	children: React.ReactNode;
	step?: number;
	className?: string;
}

interface TimelineContentProps {
	children: React.ReactNode;
	className?: string;
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
	({ children, className, ...props }, ref) => {
		return (
			<div ref={ref} className={cn("relative space-y-4", className)} {...props}>
				<div className="absolute left-4 top-0 h-full w-px bg-border" />
				{children}
			</div>
		);
	},
);
Timeline.displayName = "Timeline";

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
	({ children, step, className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn("relative flex items-start gap-4", className)}
				{...props}
			>
				{step && (
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background border-2 border-border text-sm font-medium">
						{step}
					</div>
				)}
				{children}
			</div>
		);
	},
);
TimelineItem.displayName = "TimelineItem";

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
	({ children, className, ...props }, ref) => {
		return (
			<div ref={ref} className={cn("flex-1 space-y-1", className)} {...props}>
				{children}
			</div>
		);
	},
);
TimelineContent.displayName = "TimelineContent";

export { Timeline, TimelineItem, TimelineContent };
