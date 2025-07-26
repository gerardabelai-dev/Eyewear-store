import { createAuthClient } from "better-auth/react";
import { clientEnv } from "./env-client";

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

// Client-side session utilities
export function useCurrentUser() {
	const { data: session } = useSession();
	return session?.user || null;
}
