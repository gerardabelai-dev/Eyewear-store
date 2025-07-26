import { DashboardHeader } from "@/components/dashboard-header";
import { getUserProfile } from "@/lib/actions/user";

export async function UserHeaderWrapper() {
	const userResult = await getUserProfile();

	if (userResult.error || !userResult.data) {
		// Return a minimal header for error state
		return (
			<DashboardHeader
				userImage={null}
				userInitials="??"
				userName="Usuário"
				userEmail=""
			/>
		);
	}

	const userProfile = userResult.data;

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userInitials = getInitials(
		`${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() ||
			"User",
	);

	const userName =
		`${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() ||
		"Usuário";

	return (
		<DashboardHeader
			userImage={userProfile.image}
			userInitials={userInitials}
			userName={userName}
			userEmail={userProfile.email}
		/>
	);
}
