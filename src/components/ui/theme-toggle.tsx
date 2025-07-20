"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Toggle } from "@/components/ui/toggle";

export function ThemeToggle() {
	const { theme, setTheme, systemTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch by only rendering after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		// Return a placeholder that matches the final component structure
		return (
			<Toggle
				variant="outline"
				className="group data-[state=on]:hover:bg-muted size-9 data-[state=on]:bg-transparent"
				aria-label="Loading theme toggle"
			>
				<SunIcon size={16} className="shrink-0" aria-hidden="true" />
			</Toggle>
		);
	}

	// Determine if we're currently in dark mode
	const currentTheme = theme === "system" ? systemTheme : theme;
	const isDark = currentTheme === "dark";

	return (
		<Toggle
			variant="outline"
			className="group data-[state=on]:hover:bg-muted size-9 data-[state=on]:bg-transparent"
			pressed={isDark}
			onPressedChange={() => {
				if (theme === "system" || !theme) {
					// If user hasn't clicked before (system default), set to opposite of current system theme
					setTheme(systemTheme === "dark" ? "light" : "dark");
				} else {
					// If user has clicked before, toggle between light and dark
					setTheme(isDark ? "light" : "dark");
				}
			}}
			aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
		>
			{/* Note: After dark mode implementation, rely on dark: prefix rather than group-data-[state=on]: */}
			<MoonIcon
				size={16}
				className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
				aria-hidden="true"
			/>
			<SunIcon
				size={16}
				className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
				aria-hidden="true"
			/>
		</Toggle>
	);
}
