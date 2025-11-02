import { useQuery } from "@tanstack/react-query";

export interface CollectionProduct {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	stock: number;
	status: "active" | "inactive";
	priceInCents: number;
	discountPercentage: number;
	isDefault: boolean;
}

export interface Collection {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	isActive: boolean;
	products: CollectionProduct[];
}

async function fetchCollections(): Promise<Collection[]> {
	const response = await fetch("/api/collections");

	if (!response.ok) {
		throw new Error("Houve um erro ao buscar as coleções");
	}

	return response.json();
}

export function useCollections() {
	return useQuery({
		queryKey: ["collections"],
		queryFn: fetchCollections,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}
