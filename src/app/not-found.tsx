import { AppLogo } from "@/components/brand";

export default function NotFound() {
	return (
		<div className="min-h-[400px] flex flex-col items-center justify-center">
			<AppLogo />
			<div className="text-center ">
				<h1 className="text-4xl font-bold font-serif">404</h1>
				<p className="text-muted-foreground mt-2">Página não encontrada</p>
			</div>
		</div>
	);
}
