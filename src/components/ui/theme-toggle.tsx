"use client";

import { Monitor, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

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
			<Button
				variant="outline"
				size="icon"
				className="h-9 w-9"
				aria-label="Loading theme toggle"
			>
				<Monitor className="h-4 w-4" />
			</Button>
		);
	}

	// Cycle through themes: system -> light -> dark -> system
	const handleThemeToggle = () => {
		if (theme === "system") {
			setTheme("light");
		} else if (theme === "light") {
			setTheme("dark");
		} else {
			setTheme("system");
		}
	};

	// Determine current icon and label
	const getThemeIcon = () => {
		if (theme === "system") {
			return <Monitor className="h-4 w-4" />;
		} else if (theme === "light") {
			return <SunIcon className="h-4 w-4" />;
		} else {
			return <MoonIcon className="h-4 w-4" />;
		}
	};

	const getThemeLabel = () => {
		if (theme === "system") {
			return "Sistema";
		} else if (theme === "light") {
			return "Claro";
		} else {
			return "Escuro";
		}
	};

	return (
		<Button
			variant="outline"
			size="icon"
			className="h-9 w-9"
			onClick={handleThemeToggle}
			aria-label={`Tema atual: ${getThemeLabel()}. Clique para alternar`}
			title={`Tema: ${getThemeLabel()}`}
		>
			{getThemeIcon()}
		</Button>
	);
}
