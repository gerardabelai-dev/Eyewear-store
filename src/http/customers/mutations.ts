import { useMutation } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import type {
	CreateCustomerRequest,
	CreateCustomerResponse,
} from "@/http/types";

export const useCreateCustomerMutation = (options?: {
	onSuccess?: (data: CreateCustomerResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: CreateCustomerRequest,
		): Promise<CreateCustomerResponse> => {
			const response = await fetch("/api/customers/create-customer", {
				method: "POST",
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.FAILED_TO_CREATE_CUSTOMER);
			}

			return await response.json();
		},
		...options,
	});
