"use client";

import { ThemeProvider } from "next-themes";
import { ZodProvider } from "@/app/providers/zod-provider";
import { TanstackClientQueryProvider } from "./tanstack-client-query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<ZodProvider>
				<TanstackClientQueryProvider>{children}</TanstackClientQueryProvider>
			</ZodProvider>
		</ThemeProvider>
	);
}
