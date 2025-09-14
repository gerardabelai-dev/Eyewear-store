import { useMutation } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import type {
	CreateCustomerAddressRequest,
	CreateCustomerAddressResponse,
} from "@/http/types";
import { handleApiError } from "@/lib/utils/handle-api-error";

export const useCreateCustomerAddressMutation = (options?: {
	onSuccess?: (data: CreateCustomerAddressResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: CreateCustomerAddressRequest,
		): Promise<CreateCustomerAddressResponse> => {
			const response = await fetch(
				"/api/customers-addresses/create-customer-address",
				{
					method: "POST",
					body: JSON.stringify(data),
				},
			);

			if (!response.ok) {
				await handleApiError(
					response,
					ERROR_CODES.FAILED_TO_CREATE_CUSTOMER_ADDRESS,
				);
			}

			return await response.json();
		},
		...options,
	});
