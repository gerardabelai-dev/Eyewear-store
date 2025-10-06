import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
// biome-ignore lint/correctness/noUnusedImports: react-email
import * as React from "react";
import { formatPrice } from "@/lib/format-price";

const _baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "";

interface OrderProductSubItem {
	name: string;
	price: number;
	quantity: number;
}

interface OrderProduct {
	name: string;
	image: string;
	price: number;
	quantity: number;
	prescription?: string;
	subItems?: OrderProductSubItem[];
}

interface OrderConfirmedEmailProps {
	customerName: string;
	orderNumber: string;
	orderDate: string;
	products: OrderProduct[];
	subtotal: number;
	shipping: number;
	total: number;
	shippingAddress: {
		street: string;
		city: string;
		state: string;
		zipCode: string;
	};
	trackingUrl?: string;
}

const OrderConfirmedEmail = ({
	customerName,
	orderNumber,
	orderDate,
	products,
	subtotal,
	shipping,
	total,
	shippingAddress,
	trackingUrl,
}: OrderConfirmedEmailProps) => {
	return (
		<Html lang="pt-BR" dir="ltr">
			<Head />
			<Preview>
				Pedido #{orderNumber} confirmado! Seus óculos estão a caminho.
			</Preview>
			<Tailwind>
				<Body className="bg-[#F6F8FA] font-sans py-[40px]">
					<Container className="bg-white max-w-[600px] mx-auto">
						{/* Header */}
						<Section className="bg-white px-[40px] pt-[40px] pb-[20px]">
							<Img
								src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/branding/drvista-logo.png"
								alt="Dr. Vista"
								width="200"
								className="w-full max-w-[200px] mx-auto block"
							/>
						</Section>

						{/* Main Content */}
						<Section className="px-[40px] py-[20px]">
							<Heading className="text-[#333] text-[28px] font-bold text-center mb-[24px] mt-0">
								Pedido Confirmado!
							</Heading>

							<Text className="text-[#333] text-[16px] leading-[24px] mb-[20px]">
								Olá {customerName},
							</Text>

							<Text className="text-[#333] text-[16px] leading-[24px] mb-[32px]">
								Seu pedido foi confirmado com sucesso! Estamos preparando seus
								óculos com todo cuidado e atenção. Em breve você receberá suas
								novas lentes em casa.
							</Text>

							{/* Order Details */}
							<Section className="bg-[#F6F8FA] p-[24px] mb-[32px]">
								<Row>
									<Column>
										<Text className="text-[#333] text-[14px] font-semibold mb-[8px] m-0">
											Número do Pedido
										</Text>
										<Text className="text-[#666] text-[14px] mb-[16px] m-0">
											#{orderNumber}
										</Text>
									</Column>
									<Column>
										<Text className="text-[#333] text-[14px] font-semibold mb-[8px] m-0">
											Data do Pedido
										</Text>
										<Text className="text-[#666] text-[14px] mb-[16px] m-0">
											{orderDate}
										</Text>
									</Column>
								</Row>
							</Section>

							{/* Products */}
							<Section className="mb-[32px]">
								<Heading className="text-[#333] text-[20px] font-bold mb-[20px] mt-0">
									Produtos
								</Heading>

								{products.map((product, index) => (
									<Section
										key={index}
										className="border-b border-solid border-[#E5E7EB] pb-[20px] mb-[20px]"
									>
										<Row>
											<Column className="w-[80px] align-top">
												<Img
													src={product.image}
													alt={product.name}
													width="80"
													className="w-full"
												/>
											</Column>
											<Column className="pl-[16px] align-top">
												<Text className="text-[#333] text-[16px] font-semibold mb-[4px] m-0">
													{product.name}
												</Text>
												{product.prescription && (
													<Text className="text-[#666] text-[14px] mb-[4px] m-0">
														Receita: {product.prescription}
													</Text>
												)}
												<Text className="text-[#34A759] text-[16px] font-semibold mb-[4px] m-0">
													{formatPrice(product.price)}
												</Text>
												<Text className="text-[#666] text-[14px] m-0">
													Quantidade: {product.quantity}
												</Text>

												{/* Sub-items (lens options) */}
												{product.subItems && product.subItems.length > 0 && (
													<Section className="mt-[12px] pl-[12px] border-l-2 border-solid border-[#E5E7EB]">
														{product.subItems.map((subItem, subIndex) => (
															<Row key={subIndex} className="mb-[8px]">
																<Column>
																	<Text className="text-[#666] text-[14px] mb-[2px] m-0">
																		+ {subItem.name}
																	</Text>
																	<Text className="text-[#666] text-[12px] m-0">
																		{formatPrice(subItem.price)} x{" "}
																		{subItem.quantity}
																	</Text>
																</Column>
															</Row>
														))}
													</Section>
												)}
											</Column>
										</Row>
									</Section>
								))}
							</Section>

							{/* Order Summary */}
							<Section className="bg-[#F6F8FA] p-[24px] mb-[32px]">
								<Heading className="text-[#333] text-[18px] font-bold mb-[16px] mt-0">
									Resumo do Pedido
								</Heading>

								<Row className="mb-[8px]">
									<Column>
										<Text className="text-[#666] text-[14px] m-0">
											Subtotal
										</Text>
									</Column>
									<Column className="text-right">
										<Text className="text-[#666] text-[14px] m-0">
											{formatPrice(subtotal)}
										</Text>
									</Column>
								</Row>

								<Row className="mb-[16px]">
									<Column>
										<Text className="text-[#666] text-[14px] m-0">Frete</Text>
									</Column>
									<Column className="text-right">
										<Text className="text-[#666] text-[14px] m-0">
											{formatPrice(shipping)}
										</Text>
									</Column>
								</Row>

								<Hr className="border-[#E5E7EB] border-solid my-[16px]" />

								<Row>
									<Column>
										<Text className="text-[#333] text-[16px] font-bold m-0">
											Total
										</Text>
									</Column>
									<Column className="text-right">
										<Text className="text-[#34A759] text-[18px] font-bold m-0">
											{formatPrice(total)}
										</Text>
									</Column>
								</Row>
							</Section>

							{/* Shipping Address */}
							<Section className="mb-[32px]">
								<Heading className="text-[#333] text-[18px] font-bold mb-[16px] mt-0">
									Endereço de Entrega
								</Heading>
								<Text className="text-[#666] text-[14px] leading-[20px] m-0">
									{shippingAddress.street}
									<br />
									{shippingAddress.city}, {shippingAddress.state}
									<br />
									CEP: {shippingAddress.zipCode}
								</Text>
							</Section>

							{/* Tracking Button */}
							{trackingUrl && (
								<Section className="text-center my-[32px]">
									<Button
										href={trackingUrl}
										className="bg-[#34A759] text-white px-[32px] py-[16px] text-[16px] font-semibold"
										style={{
											textDecoration: "none",
											display: "inline-block",
											borderRadius: "8px",
										}}
									>
										Acompanhar Pedido
									</Button>
								</Section>
							)}
						</Section>

						{/* Footer */}
						<Hr className="border-[#E5E7EB] border-solid my-[32px] mx-[40px]" />

						<Section className="px-[40px] pb-[40px]">
							<Text className="text-[#666] text-[14px] leading-[20px] text-center mb-[16px] m-0">
								Dr. Vista
								<br />
								Rua Pedro Porto, 31, Casa 2, Vila Arruda
								<br />
								Itapetininga, São Paulo, 18212-090
							</Text>

							<Text className="text-[#666] text-[14px] leading-[20px] text-center mb-[16px]">
								<Link
									href="https://drvista.com.br"
									className="text-[#34A759]"
									style={{ textDecoration: "none" }}
								>
									drvista.com.br
								</Link>
							</Text>

							<Text className="text-[#666] text-[12px] leading-[16px] text-center mb-[8px]">
								© 2025 Dr. Vista. Todos os direitos reservados.
							</Text>

							<Text className="text-[#666] text-[12px] leading-[16px] text-center m-0">
								Se você recebeu este e-mail por engano, por favor, desconsidere
								e entre em contato com nosso suporte pelo e-mail
								atendimento@drvista.com.br
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

OrderConfirmedEmail.PreviewProps = {
	customerName: "Maria Santos",
	orderNumber: "DV-2025-001234",
	orderDate: "05 de Janeiro de 2025",
	products: [
		{
			name: "Incredible Steel Mouse",
			image: "https://new.email/static/app/placeholder.png",
			price: 66650, // Total: 1650 (base) + 15000 + 30000 + 20000
			quantity: 1,
			prescription: "OD: -2.00 | OE: -1.75",
			subItems: [
				{
					name: "Com grau",
					price: 15000,
					quantity: 1,
				},
				{
					name: "Grau moderado | até +/- 4,00",
					price: 30000,
					quantity: 1,
				},
				{
					name: "Filtro de luz azul",
					price: 20000,
					quantity: 1,
				},
			],
		},
		{
			name: "Óculos de Sol Premium",
			image: "https://new.email/static/app/placeholder.png",
			price: 18990,
			quantity: 1,
		},
	],
	subtotal: 85640, // 66650 + 18990
	shipping: 1500,
	total: 87140,
	shippingAddress: {
		street: "Rua das Flores, 123, Apto 45",
		city: "São Paulo",
		state: "SP",
		zipCode: "01234-567",
	},
	trackingUrl: "https://drvista.com.br/pedidos/DV-2025-001234",
};

export default OrderConfirmedEmail;
