import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
// biome-ignore lint/correctness/noUnusedImports: react-email
import * as React from "react";

const baseUrl = process.env.WEB_URL || "https://acme.com";
const brandName = "ACME";
const logoUrl = `${baseUrl}/static/acme-logo.png`;

interface PrescriptionProduct {
	name: string;
	image: string;
}

interface PrescriptionReminderEmailProps {
	customerName: string;
	orderNumber: string;
	products: PrescriptionProduct[];
	uploadUrl: string;
}

const PrescriptionReminderEmail = ({
	customerName,
	orderNumber,
	products,
	uploadUrl,
}: PrescriptionReminderEmailProps) => {
	return (
		<Html lang="pt-BR" dir="ltr">
			<Head />
			<Preview>
				Lembrete: Envie sua receita para o pedido #{orderNumber}
			</Preview>
			<Tailwind>
				<Body className="bg-gray-50 font-sans">
					<Container className="mx-auto py-12 px-4 max-w-[600px]">
						{/* Header */}
						<Section className="bg-white rounded-lg shadow-sm p-8 mb-6">
							<Img
								src={logoUrl}
								width="150"
								alt={brandName}
								className="mx-auto mb-6"
							/>
							<Heading className="text-2xl font-bold text-gray-900 text-center mb-2">
								Não esqueça de enviar sua receita!
							</Heading>
							<Text className="text-gray-600 text-center mb-0">
								Pedido #{orderNumber}
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="bg-white rounded-lg shadow-sm p-8 mb-6">
							<Text className="text-gray-900 mb-4">
								Olá, {customerName}!
							</Text>

							<Text className="text-gray-700 mb-4">
								Notamos que você ainda não enviou a receita médica para os
								seguintes produtos do seu pedido:
							</Text>

							{/* Products List */}
							<Section className="bg-gray-50 rounded-lg p-4 mb-6">
								{products.map((product, index) => (
									<Section key={index} className="mb-3 last:mb-0">
										<table width="100%">
											<tr>
												<td width="80" valign="top">
													<Img
														src={product.image}
														width="60"
														height="60"
														alt={product.name}
														className="rounded-md"
													/>
												</td>
												<td valign="middle">
													<Text className="text-gray-900 font-medium mb-0">
														{product.name}
													</Text>
													<Text className="text-sm text-amber-600 mb-0">
														⚠️ Receita pendente
													</Text>
												</td>
											</tr>
										</table>
									</Section>
								))}
							</Section>

							<Text className="text-gray-700 mb-4">
								Para darmos continuidade ao seu pedido, precisamos que você envie
								a receita médica o quanto antes. É rápido e fácil!
							</Text>

							<Text className="text-gray-700 mb-6">
								Você pode enviar arquivos em PDF, JPG, PNG ou HEIC (fotos do
								iPhone).
							</Text>

							{/* CTA Button */}
							<Section className="text-center mb-6">
								<Button
									href={uploadUrl}
									className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg inline-block"
								>
									Enviar Receita Agora
								</Button>
							</Section>

							<Text className="text-sm text-gray-500 mb-2">
								Ou copie e cole este link no seu navegador:
							</Text>
							<Text className="text-sm text-blue-600 break-all mb-0">
								{uploadUrl}
							</Text>
						</Section>

						{/* Help Section */}
						<Section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
							<Text className="text-blue-900 font-semibold mb-2">
								💡 Dica
							</Text>
							<Text className="text-blue-800 text-sm mb-0">
								Se você não tem uma cópia digital da sua receita, basta tirar
								uma foto com o seu celular e fazer o upload. Certifique-se de
								que a foto está nítida e legível.
							</Text>
						</Section>

						{/* Footer */}
						<Section className="text-center">
							<Hr className="border-gray-300 my-6" />
							<Text className="text-gray-600 text-sm mb-2">
								Precisa de ajuda?{" "}
								<Link
									href={`${baseUrl}/contato`}
									className="text-blue-600 underline"
								>
									Entre em contato conosco
								</Link>
							</Text>
							<Text className="text-gray-500 text-xs mb-2">
								{brandName} - Óculos de Qualidade
							</Text>
							<Text className="text-gray-500 text-xs mb-0">
								Este é um e-mail automático. Por favor, não responda.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default PrescriptionReminderEmail;

// Preview data for development
PrescriptionReminderEmail.PreviewProps = {
	customerName: "João Silva",
	orderNumber: "ord_abc123",
	products: [
		{
			name: "Óculos Redondo Bold",
			image:
				"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/glassesshop-7WUyUtVcKSk-unsplash.jpg",
		},
		{
			name: "Óculos Aviador Clássico",
			image:
				"https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/colin-lloyd-uGS733o4Ukk-unsplash.jpg",
		},
	],
	uploadUrl: `${baseUrl}/checkout/ord_abc123/success`,
} as PrescriptionReminderEmailProps;
