"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { CategoriesTableWrapper } from "@/components/categories-table-wrapper";

export function CategoriesTableClient() {
	const { data } = useInfiniteQuery({
		queryKey: ["categories"],
		queryFn: ({ pageParam = 1 }) =>
			fetch(`/api/categories?page=${pageParam}`).then((res) => res.json()),
		getNextPageParam: (lastPage) =>
			lastPage.length ? lastPage.page + 1 : undefined,
		initialPageParam: 1,
	});
	const categories = data?.pages.flat() ?? [];
	return <CategoriesTableWrapper categories={categories} />;
}
