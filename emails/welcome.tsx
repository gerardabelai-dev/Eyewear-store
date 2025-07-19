import WelcomeEmail from "../src/components/emails/welcome-email";

export default function WelcomeEmailPreview() {
	return (
		<WelcomeEmail
			name="João Silva"
			email="joao@example.com"
			unsubscribeUrl="http://localhost:3000/unsubscribe?token=sample-token"
		/>
	);
}
