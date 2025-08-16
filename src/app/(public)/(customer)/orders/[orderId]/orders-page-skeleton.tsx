import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersPageSkeleton() {
	return (
		<>
			{/* Tracking code skeleton */}
			<div className="flex flex-col">
				<h3 className="text-sm font-bold">Codigo de rastreio</h3>
				<Skeleton className="h-4 w-32" />
			</div>

			<section className="grid grid-cols-1 gap-4">
				{/* Order items skeleton */}
				<div className="flex flex-col gap-4">
					{/* Product 1 skeleton */}
					<div className="flex gap-4">
						<Skeleton className="w-48 md:w-96 aspect-video rounded" />
						<div className="flex flex-col justify-between gap-2 flex-1">
							<div className="flex flex-col gap-2">
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-4 w-48" />
								<Skeleton className="h-5 w-20" />
							</div>
							<div className="flex flex-col md:flex-row md:items-center gap-2">
								<Skeleton className="h-4 w-24" />
								<Separator className="hidden md:block" orientation="vertical" />
								<Skeleton className="h-4 w-28" />
							</div>
						</div>
					</div>

					<Separator className="my-6" />

					{/* Product 2 skeleton */}
					<div className="flex gap-4">
						<Skeleton className="w-48 md:w-96 aspect-video rounded" />
						<div className="flex flex-col justify-between gap-2 flex-1">
							<div className="flex flex-col gap-2">
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-4 w-48" />
								<Skeleton className="h-5 w-20" />
							</div>
							<div className="flex flex-col md:flex-row md:items-center gap-2">
								<Skeleton className="h-4 w-24" />
								<Separator className="hidden md:block" orientation="vertical" />
								<Skeleton className="h-4 w-28" />
							</div>
						</div>
					</div>
				</div>

				<Separator className="my-6" />

				{/* Timeline skeleton */}
				<div className="flex flex-col gap-2">
					<div className="space-y-6">
						{[1, 2, 3, 4].map((step) => (
							<div key={step} className="flex gap-4">
								<div className="flex flex-col items-center">
									<Skeleton className="w-6 h-6 rounded-full" />
									{step < 4 && <Skeleton className="w-0.5 h-16 mt-2" />}
								</div>
								<div className="flex-1 space-y-2">
									<div className="flex gap-2">
										<Skeleton className="h-3 w-12" />
										<Skeleton className="h-4 w-32" />
									</div>
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
							</div>
						))}
					</div>
				</div>

				<Separator className="my-6" />

				{/* Address details skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="flex flex-col gap-4">
						<h3 className="text-sm font-bold">Endereço de entrega</h3>
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-4 w-40" />
					</div>

					<div className="flex flex-col gap-4">
						<h3 className="text-sm font-bold">Endereço de cobrança</h3>
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-4 w-40" />
					</div>
				</div>

				<Separator className="my-6" />

				{/* Payment and shipping method skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="flex flex-col gap-4">
						<h3 className="text-sm font-bold">Método de pagamento</h3>
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-16" />
					</div>

					<div className="flex flex-col gap-4">
						<h3 className="text-sm font-bold">Método de envio</h3>
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>

				<Separator className="my-6" />

				{/* Order summary skeleton */}
				<div className="flex flex-col gap-4 text-sm">
					<div className="flex gap-4 justify-between">
						<strong>Subtotal</strong>
						<Skeleton className="h-4 w-16" />
					</div>

					<div className="flex gap-4 justify-between">
						<div className="flex items-center gap-2">
							<strong>Desconto</strong>
							<Skeleton className="h-5 w-16 rounded-full" />
						</div>
						<Skeleton className="h-4 w-20" />
					</div>

					<div className="flex gap-4 justify-between">
						<strong>Frete</strong>
						<Skeleton className="h-4 w-16" />
					</div>

					<div className="flex gap-4 justify-between">
						<strong>Taxas e impostos</strong>
						<Skeleton className="h-4 w-16" />
					</div>

					<div className="flex gap-4 justify-between">
						<strong>Total</strong>
						<Skeleton className="h-4 w-16" />
					</div>
				</div>
			</section>
		</>
	);
}
