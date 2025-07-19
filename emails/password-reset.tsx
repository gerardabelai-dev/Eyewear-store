import PasswordResetEmail from "../src/components/emails/password-reset-email";

export default function PasswordResetEmailPreview() {
	return (
		<PasswordResetEmail
			name="Carlos Oliveira"
			resetUrl="http://localhost:3000/auth/reset-password?token=sample-reset-token"
			expiresIn="1 hora"
			unsubscribeUrl="http://localhost:3000/unsubscribe?token=sample-token"
		/>
	);
}
