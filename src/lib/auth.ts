import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, bearer, magicLink } from "better-auth/plugins";
import { localization } from "better-auth-localization";
import CompleteRegistrationEmail from "../../emails/complete-registration";
import ResetPasswordEmail from "../../emails/reset-password";
import { db } from "./db";
import { env } from "./env";
import { resend } from "./resend/client";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		sendResetPassword: async ({ user, token }, _request) => {
			const resetUrl = `${env.WEB_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
			const brandName = "ACME";
			const fromEmail = process.env.CONTACT_EMAIL || "contato@acme.com";

			const { data, error } = await resend.emails.send({
				from: `${brandName} <${fromEmail}>`,
				to: [user.email],
				subject: `Redefinir senha - ${brandName}`,
				react: ResetPasswordEmail({
					customerName: user.name,
					resetPasswordUrl: resetUrl,
				}),
			});

			if (error) {
				console.error("Error sending reset password email:", error);
			}

			if (data) {
				console.log("Reset password email sent successfully:", data);
			}
		},
		onPasswordReset: async ({ user }, _request) => {
			console.log(`Password for user ${user.email} has been reset.`);
		},
	},
	session: {
		fields: {
			ipAddress: "ipAddress",
		},
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60 * 1000, // 5 minutes
		},
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	baseURL: env.WEB_URL,
	trustedOrigins: [env.WEB_URL],
	plugins: [
		admin(),
		bearer(),
		localization({
			defaultLocale: "pt-BR", // Use built-in Portuguese translations
			fallbackLocale: "default", // Fallback to English
		}),
		magicLink({
			sendMagicLink: async ({ email, url: _url, token: _token }, _request) => {
				const brandName = "ACME";
				const fromEmail = process.env.CONTACT_EMAIL || "contato@acme.com";

				const { data, error } = await resend.emails.send({
					from: `${brandName} <${fromEmail}>`,
					to: [email],
					subject: `Bem-vindo à ${brandName}! Complete seu cadastro.`,
					react: CompleteRegistrationEmail({
						customerName: email,
						resetPasswordUrl: `${env.WEB_URL}/reset-password`,
					}),
				});

				if (error) {
					console.error("Error sending magic link:", error);
				}

				if (data) {
					console.log("Magic link sent successfully:", data);
				}
			},
		}),
	],
	onAPIError: {
		throw: true,
		onError(error: any, ctx: any) {
			console.error("Auth error:", error, ctx);
		},
		errorURL: "/sign-in?error=failed",
	},
});
