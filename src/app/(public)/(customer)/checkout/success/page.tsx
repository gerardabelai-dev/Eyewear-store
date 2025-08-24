"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CartProduct } from "@/components/ui/cart-product";
import { Separator } from "@/components/ui/separator";

export default function CheckoutSuccessPage() {
	return (
		<>
			<h2 className="text-md text-vibrant -mb-6">Obrigado!</h2>

			<PageHeader
				title="Está a caminho"
				description="Seu pedido #ABC123 foi processado e chegará em breve"
				action={
					<Button variant="vibrant" size="lg" asChild>
						<Link href="/orders">Acompanhar pedido</Link>
					</Button>
				}
			/>

			<div className="flex flex-col">
				<h3 className="text-sm font-bold">Codigo de rastreio</h3>
				<span className="text-sm text-vibrant">1234567890</span>
			</div>

			<section className="grid grid-cols-1 gap-4">
				{/* Cart items */}
				<ul className="flex flex-col gap-4">
					{/* Product 1 */}
					<CartProduct productId="ekko-1" imageSize="lg">
						<CartProduct.Image
							imageUrl="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
							alt="Óculos de grau"
							href="/cart"
						/>

						<CartProduct.Content>
							<CartProduct.Header>
								<CartProduct.Name name="Ekko" />
								<CartProduct.Description description="Gatinho | Metal" />
								<CartProduct.Price priceInCents={10000} />
							</CartProduct.Header>

							<CartProduct.QuantityDisplay quantity={1} unitPrice={10000} />
						</CartProduct.Content>
					</CartProduct>

					<Separator className="my-6" />

					{/* Product 2 */}
					<CartProduct productId="ekko-2" imageSize="lg">
						<CartProduct.Image
							imageUrl="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
							alt="Óculos de grau"
							href="/cart"
						/>

						<CartProduct.Content>
							<CartProduct.Header>
								<CartProduct.Name name="Ekko" />
								<CartProduct.Description description="Gatinho | Metal" />
								<CartProduct.Price priceInCents={10000} />
							</CartProduct.Header>

							<CartProduct.QuantityDisplay quantity={1} unitPrice={10000} />
						</CartProduct.Content>
					</CartProduct>

					<Separator className="my-6" />

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="flex flex-col gap-4">
							<h3 className="text-sm font-bold">Endereço de entrega</h3>
							<span className="text-sm text-muted-foreground">
								Kristin Watson
							</span>
							<span className="text-sm text-muted-foreground">
								7363 Cynthia Pass
							</span>
							<span className="text-sm text-muted-foreground">
								Toronto, ON N3Y 4H8
							</span>
						</div>

						<div className="flex flex-col gap-4">
							<h3 className="text-sm font-bold">Endereço de cobrança</h3>
							<span className="text-sm text-muted-foreground">
								Kristin Watson
							</span>
							<span className="text-sm text-muted-foreground">
								7363 Cynthia Pass
							</span>
							<span className="text-sm text-muted-foreground">
								Toronto, ON N3Y 4H8
							</span>
						</div>
					</div>

					<Separator className="my-6" />

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="flex flex-col gap-4">
							<h3 className="text-sm font-bold">Método de pagamento</h3>
							<span className="text-sm text-muted-foreground">Apple Pay</span>
							<span className="text-sm text-muted-foreground">Mastercard</span>
							<span className="text-sm text-muted-foreground">••••1545</span>
						</div>

						<div className="flex flex-col gap-4">
							<h3 className="text-sm font-bold">Método de envio</h3>
							<span className="text-sm text-muted-foreground">DHL</span>
							<span className="text-sm text-muted-foreground">
								Chega em até 3 dias úteis
							</span>
						</div>
					</div>

					<Separator className="my-6" />

					<div className="flex flex-col gap-4 text-sm">
						<div className="flex gap-4 justify-between">
							<strong>Subtotal</strong>
							<span>R$ 100,00</span>
						</div>

						<div className="flex gap-4 justify-between">
							<strong>
								Desconto <Badge variant="secondary">ABC123</Badge>
							</strong>
							<span>-R$20, 00 (50%)</span>
						</div>

						<div className="flex gap-4 justify-between">
							<strong>Frete</strong>
							<span>R$ 10,00</span>
						</div>

						<div className="flex gap-4 justify-between">
							<strong>Taxas e impostos</strong>
							<span>R$ 5,00</span>
						</div>

						<div className="flex gap-4 justify-between">
							<strong>Total</strong>
							<span>R$ 85,00</span>
						</div>
					</div>
				</ul>
			</section>
		</>
	);
}
