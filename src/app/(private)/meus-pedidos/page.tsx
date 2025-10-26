import { getCurrentUser } from "@/lib/auth-server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";

export default async function CustomerOrdersPage() {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error("User not found");
	}

	return (
		<div className="mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
			<PageHeader
				title="Meus Pedidos"
				description="Verifique o status de pedidos recentes, gerencie devoluções e descubra produtos semelhantes."
			/>

			{/* Order List */}
			<div className="flex flex-col gap-6">
				{/* Order */}
				<div className="border border-muted rounded p-6 text-sm">
					{/* Order header */}
					<div className="flex gap-8">
						{/* Order Number */}
						<div className="flex flex-col gap-2">
							<strong className="font-medium">Número do Pedido</strong>
							<span className="text-xs">#123123</span>
						</div>

						{/* Order date */}
						<div className="flex flex-col gap-2">
							<strong className="font-medium">Pedido em</strong>
							<span className="text-xs">6 de Jul, 2025</span>
						</div>

						{/* Order total amount */}
						<div className="flex flex-col gap-2">
							<strong className="font-medium">Valor total</strong>
							<span className="font-medium text-xs">R$1.700,00</span>
						</div>

						{/* Order actions */}
						<div className="flex gap-4 ml-auto my-auto">
							<Button variant="outline" size="sm">
								Ver Detalhes
							</Button>
							<Button variant="outline" size="sm">
								Ver Fatura
							</Button>
						</div>
					</div>

					{/* Order product */}
					<div className="flex flex-col gap-4 mt-6 py-6 border-t border-muted">
						{/* Order image, name, details & price */}
						<div className="flex gap-8">
							{/* Product image */}
							<div className="relative size-48 md:size-32 w-full aspect-square">
								<Image
									src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/artem-mihailov-5aKB1P_fcLw-unsplash.jpg"
									alt="Product name"
									className="object-cover rounded"
									quality={75}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</div>

							<div className="flex flex-col gap-4 w-full">
								<div className="flex gap-4 justify-between">
									{/* Product name */}
									<strong className="font-medium">Oculos Ray-ban</strong>

									{/* Product price */}
									<strong className="font-medium">R$ 700,00</strong>
								</div>

								{/* Product description */}
								<p className="text-muted-foreground">
									Você é minimalista e procura uma opção compacta para carregar?
									A Micro Mochila tem o tamanho perfeito para seus itens
									essenciais do dia a dia. Use-a como uma mochila ou como uma
									pasta para usar o dia todo.
								</p>
							</div>
						</div>

						{/* Order delivery date & actions */}
						<div className="flex gap-8 justify-between">
							{/* Product delivery status */}
							<div className="flex gap-2 items-center">
								<BadgeCheck className="text-white fill-green-500 size-6" />
								<span className="text-muted-foreground">
									Entregue em 12 de julho de 2025
								</span>
							</div>
							{/* Product actions */}
							<div className="flex gap-2 items-center">
								<Button variant="link" size="sm">
									Ver Produto
								</Button>
								<Button variant="link" size="sm">
									Comprar Novamente
								</Button>
							</div>
						</div>
					</div>

					{/* Order product */}
					<div className="flex flex-col gap-4 pt-6 border-t border-muted">
						{/* Order image, name, details & price */}
						<div className="flex gap-8">
							{/* Product image */}
							<div className="relative size-48 md:size-32 w-full aspect-square">
								<Image
									src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/artem-mihailov-5aKB1P_fcLw-unsplash.jpg"
									alt="Product name"
									className="object-cover rounded"
									quality={75}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</div>

							<div className="flex flex-col gap-4 w-full">
								<div className="flex gap-4 justify-between">
									{/* Product name */}
									<strong className="font-medium">Oculos Ray-ban</strong>

									{/* Product price */}
									<strong className="font-medium">R$ 700,00</strong>
								</div>

								{/* Product description */}
								<p className="text-muted-foreground">
									Você é minimalista e procura uma opção compacta para carregar?
									A Micro Mochila tem o tamanho perfeito para seus itens
									essenciais do dia a dia. Use-a como uma mochila ou como uma
									pasta para usar o dia todo.
								</p>
							</div>
						</div>

						{/* Order delivery date & actions */}
						<div className="flex gap-8 justify-between">
							{/* Product delivery status */}
							<div className="flex gap-2 items-center">
								<BadgeCheck className="text-white fill-green-500 size-6" />
								<span className="text-muted-foreground">
									Entregue em 12 de julho de 2025
								</span>
							</div>
							{/* Product actions */}
							<div className="flex gap-2 items-center">
								<Button variant="link" size="sm">
									Ver Produto
								</Button>
								<Button variant="link" size="sm">
									Comprar Novamente
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Order */}
				<div className="border border-muted rounded p-6 text-sm">
					{/* Order header */}
					<div className="flex gap-8">
						{/* Order Number */}
						<div className="flex flex-col gap-2">
							<strong className="font-medium">Número do Pedido</strong>
							<span className="text-xs">#123123</span>
						</div>

						{/* Order date */}
						<div className="flex flex-col gap-2">
							<strong className="font-medium">Pedido em</strong>
							<span className="text-xs">6 de Jul, 2025</span>
						</div>

						{/* Order total amount */}
						<div className="flex flex-col gap-2">
							<strong className="font-medium">Valor total</strong>
							<span className="font-medium text-xs">R$1.700,00</span>
						</div>

						{/* Order actions */}
						<div className="flex gap-4 ml-auto my-auto">
							<Button variant="outline" size="sm">
								Ver Detalhes
							</Button>
							<Button variant="outline" size="sm">
								Ver Fatura
							</Button>
						</div>
					</div>

					{/* Order product */}
					<div className="flex flex-col gap-4 mt-6 pt-6 border-t border-muted">
						{/* Order image, name, details & price */}
						<div className="flex gap-8">
							{/* Product image */}
							<div className="relative size-48 md:size-32 w-full aspect-square">
								<Image
									src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/artem-mihailov-5aKB1P_fcLw-unsplash.jpg"
									alt="Product name"
									className="object-cover rounded"
									quality={75}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</div>

							<div className="flex flex-col gap-4 w-full">
								<div className="flex gap-4 justify-between">
									{/* Product name */}
									<strong className="font-medium">Oculos Ray-ban</strong>

									{/* Product price */}
									<strong className="font-medium">R$ 700,00</strong>
								</div>

								{/* Product description */}
								<p className="text-muted-foreground">
									Você é minimalista e procura uma opção compacta para carregar?
									A Micro Mochila tem o tamanho perfeito para seus itens
									essenciais do dia a dia. Use-a como uma mochila ou como uma
									pasta para usar o dia todo.
								</p>
							</div>
						</div>

						{/* Order delivery date & actions */}
						<div className="flex gap-8 justify-between">
							{/* Product delivery status */}
							<div className="flex gap-2 items-center">
								<BadgeCheck className="text-white fill-green-500 size-6" />
								<span className="text-muted-foreground">
									Entregue em 12 de julho de 2025
								</span>
							</div>
							{/* Product actions */}
							<div className="flex gap-2 items-center">
								<Button variant="link" size="sm">
									Ver Produto
								</Button>
								<Button variant="link" size="sm">
									Comprar Novamente
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
