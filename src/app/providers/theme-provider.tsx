import { ThemeProvider } from "next-themes";

export function GlobalThemeProvider(props: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{props.children}
		</ThemeProvider>
	);
}
