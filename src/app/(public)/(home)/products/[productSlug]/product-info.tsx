"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getProductBySlugQueryOptions } from "@/http/products/queries";
import { formatPrice } from "@/lib/format-price";

export function ProductInfo({ productSlug }: { productSlug: string }) {
	const { data } = useSuspenseQuery(getProductBySlugQueryOptions(productSlug));

	console.log(data);

	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between gap-4">
				<h2 className="text-lg font-bold">{data.name}</h2>
				<strong className="text-lg font-bold">
					{formatPrice(data.productPrice[0].priceInCents)}
				</strong>
			</div>
			<p className="text-sm text-muted-foreground uppercase">{data.subtitle}</p>
		</div>
	);
}
