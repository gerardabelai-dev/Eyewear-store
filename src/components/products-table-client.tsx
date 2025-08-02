"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ProductsTableWrapper } from "@/components/products-table-wrapper";

export function ProductsTableClient() {
	const { data } = useInfiniteQuery({
		queryKey: ["products"],
		queryFn: ({ pageParam = 1 }) =>
			fetch(`/api/products?page=${pageParam}`).then((res) => res.json()),
		getNextPageParam: (lastPage) =>
			lastPage.length ? lastPage.page + 1 : undefined,
		initialPageParam: 1,
	});
	const products = data?.pages.flat() ?? [];
	return <ProductsTableWrapper products={products} />;
}
