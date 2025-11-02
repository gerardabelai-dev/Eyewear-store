import { queryOptions } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import { QUERY_KEYS } from "@/http/query-keys";
import type { GetCurrentCustomerResponse } from "@/http/types";
import { handleApiError } from "@/lib/utils/handle-api-error";

export const getCurrentCustomerQueryOptions = () =>
	queryOptions({
		queryKey: QUERY_KEYS.currentCustomer(),
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WEB_URL}/api/customers/me`,
			);

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.CUSTOMER_NOT_FOUND);
			}

			const { customer } =
				(await response.json()) as GetCurrentCustomerResponse;

			return customer;
		},
	});
