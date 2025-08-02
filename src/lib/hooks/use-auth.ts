"use client";

import { useQuery } from "@tanstack/react-query";

export function useAuth() {
	return useQuery({
		queryKey: ["session"],
		queryFn: async () => {
			const res = await fetch("/api/auth/session");
			if (!res.ok) throw new Error("Failed to fetch session");
			return res.json();
		},
		staleTime: Infinity,
	});
}
