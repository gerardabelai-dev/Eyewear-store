import { DashboardHeader } from "@/components/dashboard-header";

export async function UserHeaderWrapper() {
	// TODO: Replace with actual user data fetching
	// const user = await getCurrentUser();
	// if (!user) redirect to sign in

	// Mock user data - replace with actual user data
	const userProfile = {
		name: "João Silva",
		email: "joao.silva@example.com",
		image: null,
		initials: "JS",
		role: "admin", // Change this to "user" to test customer navigation
	};

	return <DashboardHeader user={userProfile} />;
}
