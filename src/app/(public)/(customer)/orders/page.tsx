"use client";

import { CheckIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { CartProduct } from "@/components/ui/cart-product";
import { Separator } from "@/components/ui/separator";
import {
	Timeline,
	TimelineContent,
	TimelineDate,
	TimelineHeader,
	TimelineIndicator,
	TimelineItem,
	TimelineSeparator,
	TimelineTitle,
} from "@/components/ui/timeline";

export default function OrdersPage() {
	return (
		<>
			<PageHeader
				title="Pedido #ABC123"
				description="Confirmado em 10 de agosto."
			/>

			<div className="flex flex-col">
				<h3 className="text-sm font-bold">Codigo de rastreio</h3>
				<span className="text-sm text-vibrant">1234567890</span>
			</div>

			<section className="grid grid-cols-1 gap-4">
				{/* Cart items */}
				<ul className="flex flex-col gap-4">
					{/* Product 1 */}
					<CartProduct productId="ekko-order-1" imageSize="lg">
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
					<CartProduct productId="ekko-order-2" imageSize="lg">
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

					<div className="flex flex-col gap-2">
						<Timeline defaultValue={3}>
							<TimelineItem step={1}>
								<TimelineHeader>
									<TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
									<TimelineDate className="text-xs text-muted-foreground">
										10 ago
									</TimelineDate>
									<TimelineTitle className="text-sm font-medium">
										Pedido confirmado
									</TimelineTitle>
									<TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
										<CheckIcon
											className="group-not-data-completed/timeline-item:hidden"
											size={16}
										/>
									</TimelineIndicator>
								</TimelineHeader>
								<TimelineContent>
									Pagamento aprovado e pedido confirmado com sucesso. Iniciamos
									o processo de preparação dos seus óculos.
								</TimelineContent>
							</TimelineItem>

							<TimelineItem step={2}>
								<TimelineHeader>
									<TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
									<TimelineDate className="text-xs text-muted-foreground">
										11 ago
									</TimelineDate>
									<TimelineTitle className="text-sm font-medium">
										Em preparação
									</TimelineTitle>
									<TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
										<CheckIcon
											className="group-not-data-completed/timeline-item:hidden"
											size={16}
										/>
									</TimelineIndicator>
								</TimelineHeader>
								<TimelineContent>
									Seu pedido está sendo preparado em nosso laboratório. As
									lentes estão sendo cortadas e montadas na armação selecionada.
								</TimelineContent>
							</TimelineItem>

							<TimelineItem step={3}>
								<TimelineHeader>
									<TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
									<TimelineDate className="text-xs text-muted-foreground">
										12 ago
									</TimelineDate>
									<TimelineTitle className="text-sm font-medium">
										Enviado
									</TimelineTitle>
									<TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
										<CheckIcon
											className="group-not-data-completed/timeline-item:hidden"
											size={16}
										/>
									</TimelineIndicator>
								</TimelineHeader>
								<TimelineContent>
									Pedido despacho para entrega. Seu pacote foi entregue à
									transportadora e está a caminho do endereço de entrega.
								</TimelineContent>
							</TimelineItem>

							<TimelineItem step={4}>
								<TimelineHeader>
									<TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
									<TimelineDate className="text-xs text-muted-foreground">
										Previsão: 15 ago
									</TimelineDate>
									<TimelineTitle className="text-sm font-medium">
										Entregue
									</TimelineTitle>
									<TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
										<CheckIcon
											className="group-not-data-completed/timeline-item:hidden"
											size={16}
										/>
									</TimelineIndicator>
								</TimelineHeader>
								<TimelineContent>
									Aguardando entrega no endereço de destino. Você receberá uma
									notificação assim que o pedido for entregue.
								</TimelineContent>
							</TimelineItem>
						</Timeline>
					</div>

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
