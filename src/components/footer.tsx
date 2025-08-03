import { AppLogo } from "@/components/brand";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
					<div className="w-28">
						<AppLogo showText={true} />
					</div>

					<div className="flex items-center space-x-4">
						<p className="text-sm text-muted-foreground text-center sm:text-right">
							© {currentYear} Dr. Vista. Construído com tecnologias modernas.
						</p>
						<ThemeToggle />
					</div>
				</div>
			</div>
		</footer>
	);
}
