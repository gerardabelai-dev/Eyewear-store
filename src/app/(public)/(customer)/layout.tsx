export default function CustomerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-dvh-screen flex flex-col">
			<main className="flex-1 space-y-6 p-2 sm:p-6">
				<div className="flex flex-col max-w-7xl p-2 sm:p-6 mx-auto gap-6 w-full">
					{children}
				</div>
			</main>
		</div>
	);
}
