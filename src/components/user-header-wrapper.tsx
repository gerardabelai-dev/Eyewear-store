import { DashboardHeader } from "@/components/dashboard-header";

export function UserHeaderWrapper() {
	// Mock user data
	const userProfile = {
		name: "João Silva",
		email: "joao.silva@example.com",
		image: null,
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userInitials = getInitials(userProfile.name || "User");

	return (
		<DashboardHeader
			userImage={userProfile.image}
			userInitials={userInitials}
			userName={userProfile.name}
			userEmail={userProfile.email}
		/>
	);
}
