import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

// Get current user with error handling
export async function getCurrentUser() {
	try {
		const headersList = await headers();
		const session = await auth.api.getSession({
			headers: headersList,
		});

		if (!session?.user) {
			return null;
		}

		return session.user;
	} catch (error) {
		console.error("Error getting current user:", error);
		return null;
	}
}

// Require authentication - throws error if not authenticated
export async function requireAuth() {
	try {
		const user = await getCurrentUser();

		if (!user) {
			throw new Error("Autenticação necessária. Faça login para continuar.");
		}

		return user;
	} catch (error) {
		console.error("Authentication error:", error);
		throw new Error("Erro de autenticação. Faça login novamente.");
	}
}

// Wrapper for server actions that require authentication
export function withAuth<TArgs extends any[], TReturn>(
	action: (user: any, ...args: TArgs) => Promise<TReturn>,
) {
	return async (...args: TArgs): Promise<TReturn> => {
		try {
			const user = await requireAuth();
			return await action(user, ...args);
		} catch (error) {
			// Re-throw authentication errors
			if (error instanceof Error && error.message.includes("Autenticação")) {
				throw error;
			}

			// Handle other errors
			console.error("Server action error:", error);
			throw new Error("Erro interno do servidor. Tente novamente.");
		}
	};
}

// Check if user has admin privileges
export async function requireAdmin() {
	const user = await requireAuth();

	// Add your admin check logic here
	// For now, just check if user exists
	if (!user) {
		throw new Error("Acesso administrativo necessário.");
	}

	return user;
}

// Wrapper for admin-only server actions
export function withAdminAuth<TArgs extends any[], TReturn>(
	action: (user: any, ...args: TArgs) => Promise<TReturn>,
) {
	return async (...args: TArgs): Promise<TReturn> => {
		try {
			const user = await requireAdmin();
			return await action(user, ...args);
		} catch (error) {
			// Re-throw authentication/authorization errors
			if (
				error instanceof Error &&
				(error.message.includes("Autenticação") ||
					error.message.includes("administrativo"))
			) {
				throw error;
			}

			// Handle other errors
			console.error("Admin server action error:", error);
			throw new Error("Erro interno do servidor. Tente novamente.");
		}
	};
}

// Utility to handle redirects for unauthenticated users
export async function redirectIfNotAuthenticated(redirectTo: string = "/auth") {
	const user = await getCurrentUser();

	if (!user) {
		redirect(redirectTo);
	}

	return user;
}
