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

const baseUrl = process.env.WEB_URL || "https://drvista.com.br";

interface CompleteRegistrationEmailProps {
	customerName: string;
	resetPasswordUrl?: string;
}

const CompleteRegistrationEmail = ({
	customerName,
	resetPasswordUrl,
}: CompleteRegistrationEmailProps) => {
	const resetUrl = resetPasswordUrl || `${baseUrl}/reset-password`;
	return (
		<Html lang="pt-BR" dir="ltr">
			<Head />
			<Preview>
				Bem-vindo à Dr. Vista! Complete seu cadastro e descubra nossa coleção de
				óculos.
			</Preview>
			<Tailwind>
				<Body className="bg-[#F6F8FA] font-sans py-[40px]">
					<Container className="bg-white max-w-[600px] mx-auto">
						{/* Header */}
						<Section className="bg-white px-[40px] pt-[40px] pb-[20px]">
							<Img
								src={`${baseUrl}/static/drvista-logo.png`}
								alt="Dr. Vista"
								width="200"
								className="w-full max-w-[200px] mx-auto block"
							/>
						</Section>

						{/* Main Content */}
						<Section className="px-[40px] py-[20px]">
							<Heading className="text-[#333] text-[28px] font-bold text-center mb-[24px] mt-0">
								Bem-vindo à Dr. Vista, {customerName}!
							</Heading>

							<Text className="text-[#333] text-[16px] leading-[24px] mb-[20px]">
								Para começar a aproveitar todos os benefícios da nossa
								plataforma, você precisa finalizar seu cadastro. Se ainda não
								configurou sua senha, clique no botão abaixo para completar seu
								onboarding:
							</Text>

							<Text className="text-[#333] text-[16px] leading-[24px] mb-[32px]">
								Nosso objetivo é simplificar sua experiência de compra,
								eliminando a necessidade de deslocamento até uma ótica física.
								Tudo isso com a qualidade e o atendimento profissional que você
								merece.
							</Text>

							<Section className="text-center my-[32px]">
								<Button
									href={resetUrl}
									className="bg-[#34A759] text-white px-[32px] py-[16px] text-[16px] font-semibold"
									style={{
										textDecoration: "none",
										display: "inline-block",
										borderRadius: "8px",
									}}
								>
									Finalizar Cadastro
								</Button>
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

CompleteRegistrationEmail.PreviewProps = {
	customerName: "João Silva",
	resetPasswordUrl: "https://drvista.com.br/reset-password",
};

export default CompleteRegistrationEmail;
