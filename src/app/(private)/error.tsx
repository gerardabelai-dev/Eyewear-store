"use client";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="min-h-[400px] flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-red-600">Erro</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-2">
					Algo deu errado!
				</p>
				<button
					onClick={reset}
					className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Tentar novamente
				</button>
			</div>
		</div>
	);
}
