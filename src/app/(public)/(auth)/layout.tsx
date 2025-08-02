export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-center bg-background min-h-[calc(100vh-8rem)]">
			<div className="w-full max-w-md mx-auto p-4">{children}</div>
		</div>
	);
}
