import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, bearer } from "better-auth/plugins";
import { db } from "./db";
import { serverEnv } from "./env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
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
			clientId: serverEnv.GOOGLE_CLIENT_ID,
			clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
		},
	},
	baseURL: serverEnv.NEXT_PUBLIC_APP_URL,
	trustedOrigins: [serverEnv.NEXT_PUBLIC_APP_URL],
	plugins: [admin(), bearer()],
	onAPIError: {
		throw: true,
		onError(error, ctx) {
			console.error("Auth error:", error, ctx);
		},
		errorURL: "/sign-in?error=failed",
	},
});
