import { useMutation } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import type {
	CreateCustomerRequest,
	CreateCustomerResponse,
	UpdateCustomerRequest,
	UpdateCustomerResponse,
} from "@/http/types";
import { handleApiError } from "@/lib/utils/handle-api-error";

export const useCreateCustomerMutation = (options?: {
	onSuccess?: (data: CreateCustomerResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: CreateCustomerRequest,
		): Promise<CreateCustomerResponse> => {
			const response = await fetch("/api/customers", {
				method: "POST",
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.FAILED_TO_CREATE_CUSTOMER);
			}

			return await response.json();
		},
		...options,
	});

export const useUpdateCustomerMutation = (options?: {
	onSuccess?: (data: UpdateCustomerResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: UpdateCustomerRequest,
		): Promise<UpdateCustomerResponse> => {
			const response = await fetch(`/api/customers/${data.customerId}`, {
				method: "PATCH",
				body: JSON.stringify({
					firstName: data.firstName,
					lastName: data.lastName,
					phoneNumber: data.phoneNumber,
				}),
			});

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.FAILED_TO_CREATE_CUSTOMER);
			}

			return await response.json();
		},
		...options,
	});
