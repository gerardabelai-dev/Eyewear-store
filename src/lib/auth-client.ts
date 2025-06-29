import { createAuthClient } from "better-auth/react";
import { clientEnv } from "./env";

export const authClient = createAuthClient({
	baseURL: clientEnv.NEXT_PUBLIC_APP_URL,
});

export const {
	signIn,
	signOut,
	signUp,
	useSession,
	changePassword,
	forgetPassword,
	resetPassword,
	updateUser,
} = authClient;
