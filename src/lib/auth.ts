import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { serverEnv } from "./env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		async sendResetPassword(_data: any, _request: any) {
			// Send an email to the user with a link to reset their password
			console.log("Reset password email would be sent to:", _data.email);
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
});
