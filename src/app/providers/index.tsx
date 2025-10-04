"use client";

import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
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
			<NuqsAdapter>
				<ZodProvider>
					<TanstackClientQueryProvider>{children}</TanstackClientQueryProvider>
				</ZodProvider>
			</NuqsAdapter>
		</ThemeProvider>
	);
}
