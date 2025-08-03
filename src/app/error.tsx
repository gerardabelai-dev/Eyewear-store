"use client";

import { AppLogo } from "@/components/brand";

export default function ErrorPage({ error }: { error: Error }) {
	return (
		<div className="min-h-[400px] flex flex-col items-center justify-center">
			<AppLogo />
			<div className="text-center">
				<h1 className="text-4xl font-bold text-destructive">Erro</h1>
				<p className="text-muted-foreground mt-2">Algo deu errado!</p>
				<pre>{error.message}</pre>
			</div>
		</div>
	);
}
