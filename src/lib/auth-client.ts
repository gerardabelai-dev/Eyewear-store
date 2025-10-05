import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.WEB_URL,
	plugins: [magicLinkClient()],
});

export const {
	signIn,
	signOut,
	signUp,
	useSession,
	changePassword,
	forgetPassword,
	resetPassword,
	requestPasswordReset,
	updateUser,
} = authClient;

// Client-side session utilities
export function useCurrentUser() {
	const { data: session } = useSession();
	return session?.user || null;
}
