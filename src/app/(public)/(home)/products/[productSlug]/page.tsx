import { notFound } from "next/navigation";
import { getProductBySlugQueryOptions } from "@/http/products/queries";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { CustomerReviews } from "./customer-reviews";
import { DesktopProductPage } from "./desktop-product-page";
import { MobileProductPage } from "./mobile-product-page";
import { accordionItems, customerReviews } from "./product-data";

export default async function ProductPage({
	params,
}: {
	params: Promise<{ productSlug: string }>;
}) {
	const { productSlug } = await params;

	if (!productSlug) {
		notFound();
	}

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(getProductBySlugQueryOptions(productSlug));

	return (
		<div className="max-w-7xl mx-auto flex flex-col gap-8 lg:p-4 p-2">
			<MobileProductPage
				productSlug={productSlug}
				accordionItems={accordionItems}
			/>
			<DesktopProductPage
				productSlug={productSlug}
				accordionItems={accordionItems}
			/>
			<CustomerReviews reviews={customerReviews} />
		</div>
	);
}
