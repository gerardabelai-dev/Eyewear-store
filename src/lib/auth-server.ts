import { headers } from "next/headers";
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

export async function getCurrentUser() {
	const session = await getSession();
	return session?.user || null;
}

export { auth };
