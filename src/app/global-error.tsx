"use client";

import { AppLogo } from "@/components/brand";

export default function ErrorPage({ error }: { error: Error }) {
	return (
		<div className="min-h-[400px] max-w-7xl  mx-auto text-center space-y-4 flex flex-col items-center justify-center">
			<AppLogo />
			<h1 className="text-4xl font-bold text-destructive">
				Ops, algo deu errado!
			</h1>
			<p className="text-muted-foreground mt-2">
				Por favor, tente novamente mais tarde.
			</p>
			<pre className="text-sm text-muted-foreground max-w-2xl text-wrap whitespace-pre-wrap">
				{error.message}
			</pre>
		</div>
	);
}
