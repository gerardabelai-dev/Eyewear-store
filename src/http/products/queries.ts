import { queryOptions } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { QUERY_KEYS } from "@/http/query-keys";
import type { GetProductBySlugResponse } from "@/http/types";
import { handleApiError } from "@/lib/utils/handle-api-error";

export const getProductBySlugQueryOptions = (productSlug: string) =>
	queryOptions({
		queryKey: QUERY_KEYS.product(productSlug),
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/products/${productSlug}`,
			);

			if (!response.ok) {
				await handleApiError(
					response,
					ERROR_CODES.FAILED_TO_GET_PRODUCT_DETAILS,
				);
			}

			const { product } = (await response.json()) as GetProductBySlugResponse;

			return product;
		},
	});
