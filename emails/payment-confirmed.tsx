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

const baseUrl = process.env.WEB_URL || "https://drvista.com.br";
const logoUrl = `${baseUrl}/api/images/proxy?url=${encodeURIComponent("https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/branding/drvista-logo.png")}&w=200&q=80`;

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

interface PaymentConfirmedEmailProps {
	customerName: string;
	orderNumber: string;
	orderDate: string;
	paymentMethod: string;
	products: OrderProduct[];
	subtotal: number;
	shipping: number;
	discount?: number;
	couponCode?: string;
	total: number;
	shippingAddress: {
		street: string;
		city: string;
		state: string;
		zipCode: string;
	};
	estimatedDelivery: string;
}

const PaymentConfirmedEmail = ({
	customerName,
	orderNumber,
	orderDate,
	paymentMethod,
	products,
	subtotal,
	shipping,
	discount,
	couponCode,
	total,
	shippingAddress,
	estimatedDelivery,
}: PaymentConfirmedEmailProps) => {
	return (
		<Html lang="pt-BR" dir="ltr">
			<Head />
			<Preview>
				Pagamento confirmado! Seu pedido #{orderNumber} está sendo preparado
			</Preview>
			<Tailwind>
				<Body className="bg-[#F6F8FA] font-sans py-[40px]">
					<Container className="bg-white max-w-[600px] mx-auto">
						{/* Header */}
						<Section className="bg-white px-[40px] pt-[40px] pb-[20px]">
							<Img
								src={logoUrl}
								alt="Dr. Vista"
								width="200"
								className="w-full max-w-[200px] mx-auto block"
							/>
						</Section>
						{/* Main Content */}
						<Section className="px-[40px] py-[20px]">
							<Heading className="text-[#333] text-[28px] font-bold text-center mb-[24px] mt-0">
								Pagamento Confirmado!
							</Heading>

							<Text className="text-[#333] text-[16px] leading-[24px] mb-[20px]">
								Olá {customerName},
							</Text>

							<Text className="text-[#333] text-[16px] leading-[24px] mb-[20px]">
								Ótimas notícias! Seu pagamento foi processado com sucesso e seu
								pedido já está sendo preparado com todo cuidado pela nossa
								equipe.
							</Text>

							<Text className="text-[#333] text-[16px] leading-[24px] mb-[32px]">
								Seus novos óculos estão sendo confeccionados especialmente para
								você e em breve estarão a caminho do seu endereço.
							</Text>

							{/* Order Details */}
							<Section className="bg-[#F6F8FA] p-[24px] mb-[32px]">
								<Row>
									<Column className="w-[50%] align-top">
										<Text className="text-[#333] text-[14px] font-semibold mb-[8px] m-0">
											Número do Pedido
										</Text>
										<Text className="text-[#666] text-[14px] mb-[16px] m-0">
											#{orderNumber}
										</Text>
									</Column>
									<Column className="w-[50%] align-top">
										<Text className="text-[#333] text-[14px] font-semibold mb-[8px] m-0">
											Data do Pedido
										</Text>
										<Text className="text-[#666] text-[14px] mb-[16px] m-0">
											{orderDate}
										</Text>
									</Column>
								</Row>
								<Row>
									<Column className="w-[50%] align-top">
										<Text className="text-[#333] text-[14px] font-semibold mb-[8px] m-0">
											Status do Pedido
										</Text>
										<Text className="text-[#34A759] text-[14px] font-semibold mb-[4px] m-0">
											Pagamento Aprovado
										</Text>
									</Column>
									<Column className="w-[50%] align-top">
										<Text className="text-[#333] text-[14px] font-semibold mb-[8px] m-0">
											Método de Pagamento
										</Text>
										<Text className="text-[#666] text-[14px] m-0">
											{paymentMethod}
										</Text>
									</Column>
								</Row>
							</Section>

							{/* Products */}
							<Section className="mb-[32px]">
								<Heading className="text-[#333] text-[20px] font-bold mb-[20px] mt-0">
									Produtos em Preparação
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

								{discount && discount > 0 && (
									<Row className="mb-[16px]">
										<Column>
											<Text className="text-[#666] text-[14px] m-0">
												Desconto{couponCode ? ` (${couponCode})` : ""}
											</Text>
										</Column>
										<Column className="text-right">
											<Text className="text-[#34A759] text-[14px] font-semibold m-0">
												-{formatPrice(discount)}
											</Text>
										</Column>
									</Row>
								)}

								<Hr className="border-[#E5E7EB] border-solid my-[16px]" />

								<Row>
									<Column>
										<Text className="text-[#333] text-[16px] font-bold m-0">
											Total Pago
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

							{/* Next Steps */}
							<Section className="bg-[#F6F8FA] p-[24px] mb-[32px]">
								<Heading className="text-[#333] text-[18px] font-bold mb-[16px] mt-0">
									Próximos Passos
								</Heading>
								<Text className="text-[#666] text-[14px] leading-[20px] mb-[12px] m-0">
									• Seus óculos estão sendo preparados por nossa equipe
									especializada
								</Text>
								<Text className="text-[#666] text-[14px] leading-[20px] mb-[12px] m-0">
									• Você receberá um código de rastreamento assim que o pedido
									for enviado
								</Text>
								<Text className="text-[#666] text-[14px] leading-[20px] mb-[12px] m-0">
									• Previsão de entrega: {estimatedDelivery}
								</Text>
								<Text className="text-[#666] text-[14px] leading-[20px] m-0">
									• Acompanhe o status do seu pedido em nossa plataforma
								</Text>
							</Section>

							{/* Action Button */}
							<Section className="text-center my-[32px]">
								<Button
									href={`${baseUrl}/orders/${orderNumber}`}
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

							{/* Support */}
							<Section className="text-center mb-[32px]">
								<Text className="text-[#666] text-[14px] mb-[8px]">
									Dúvidas? Nossa equipe está aqui para ajudar!
								</Text>
								<Link
									href="mailto:atendimento@drvista.com.br"
									className="text-[#34A759] text-[14px] font-semibold"
									style={{ textDecoration: "none" }}
								>
									atendimento@drvista.com.br
								</Link>
							</Section>
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

PaymentConfirmedEmail.PreviewProps = {
	customerName: "Maria Silva",
	orderNumber: "DV-2025-001234",
	orderDate: "05/01/2025 às 14:30",
	paymentMethod: "Cartão de Crédito",
	products: [
		{
			name: "Incredible Steel Mouse",
			image:
				"https://drvista.com.br/api/images/proxy?url=https%3A%2F%2Fnew.email%2Fstatic%2Fapp%2Fplaceholder.png&w=200&q=60",
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
			image:
				"https://drvista.com.br/api/images/proxy?url=https%3A%2F%2Fnew.email%2Fstatic%2Fapp%2Fplaceholder.png&w=200&q=60",
			price: 18990,
			quantity: 1,
		},
	],
	subtotal: 85640, // 66650 + 18990
	shipping: 1500,
	discount: 8564, // 10% discount
	couponCode: "WELCOME10",
	total: 78576, // 85640 + 1500 - 8564
	shippingAddress: {
		street: "Rua das Flores, 123, Apto 45",
		city: "São Paulo",
		state: "SP",
		zipCode: "01234-567",
	},
	estimatedDelivery: "7 a 10 dias úteis",
};

export default PaymentConfirmedEmail;
