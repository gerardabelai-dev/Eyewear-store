// Simple in-memory store for impersonation tokens (use Redis in production)
const impersonationTokens = new Map<
	string,
	{
		userId: string;
		userEmail: string;
		userName: string;
		sessionToken: string;
		expiresAt: Date;
	}
>();

// Helper function to get impersonation data
export function getImpersonationData(token: string) {
	const data = impersonationTokens.get(token);
	if (!data) return null;

	// Check if token is expired
	if (data.expiresAt < new Date()) {
		impersonationTokens.delete(token);
		return null;
	}

	return data;
}

// Helper function to consume impersonation token (use once)
export function consumeImpersonationToken(token: string) {
	const data = getImpersonationData(token);
	if (data) {
		impersonationTokens.delete(token);
	}
	return data;
}

// Helper function to store impersonation token
export function storeImpersonationToken(
	token: string,
	data: {
		userId: string;
		userEmail: string;
		userName: string;
		sessionToken: string;
		expiresAt: Date;
	},
) {
	impersonationTokens.set(token, data);
}
