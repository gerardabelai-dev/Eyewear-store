"use client";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard-header";

export function UserHeaderWrapper() {
	const { data: userProfile, error } = useQuery({
		queryKey: ["user", "profile"],
		queryFn: async () => {
			const response = await fetch("/api/user");
			if (!response.ok) {
				throw new Error("Failed to fetch user profile");
			}
			return response.json();
		},
	});

	if (error || !userProfile) {
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
