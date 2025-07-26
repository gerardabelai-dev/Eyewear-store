import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, bearer, openAPI } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";
import { serverEnv } from "./env";
import { enqueueEmailJob } from "./qstash";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	session: {
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
	plugins: [
		admin(),
		bearer(),
		openAPI({
			path: "/api/auth/reference",
			output: {
				file: "./auth-schema.json",
			},
		}),
	],
	user: {
		additionalFields: {
			firstName: {
				type: "string",
				required: false,
			},
			lastName: {
				type: "string",
				required: false,
			},
		},
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					// Queue welcome email job for new users
					try {
						const userData = user as any;
						const userName =
							userData.name ||
							`${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
							"Usuário";

						await enqueueEmailJob({
							type: "welcome",
							userId: userData.id,
							email: userData.email,
							data: {
								name: userName,
							},
						});
						console.log("Welcome email queued for:", userData.email);
					} catch (error) {
						console.error("Failed to queue welcome email:", error);
					}
				},
			},
			update: {
				before: async (user) => {
					// Automatically update name when firstName or lastName changes
					const userData = user as any;
					if (userData.firstName && userData.lastName) {
						return {
							data: {
								...user,
								name: `${userData.firstName} ${userData.lastName}`,
							},
						};
					}
					return { data: user };
				},
			},
		},
	},
});
