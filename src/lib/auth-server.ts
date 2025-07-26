import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

export async function getSession() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		return session;
	} catch (error) {
		console.error("Error getting session:", error);
		return null;
	}
}

// Cache getCurrentUser for the duration of the request to avoid multiple auth checks
export const getCurrentUser = cache(async () => {
	const session = await getSession();
	return session?.user || null;
});

export { auth };
