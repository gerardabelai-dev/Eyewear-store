import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, bearer } from "better-auth/plugins";
import { localization } from "better-auth-localization";
import { db } from "./db";
import { env } from "./env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		sendResetPassword: async ({ user, url, token }, _request) => {
			console.log({
				to: user.email,
				subject: "Reset your password",
				text: `Click the link to reset your password: ${url}`,
				token,
			});
		},
		onPasswordReset: async ({ user }, _request) => {
			// your logic here
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
	],
	onAPIError: {
		throw: true,
		onError(error: any, ctx: any) {
			console.error("Auth error:", error, ctx);
		},
		errorURL: "/sign-in?error=failed",
	},
});
