import { useMutation } from "@tanstack/react-query";
import { ERROR_CODES } from "@/app/api/contants/error-codes";
import type {
	ApplyCouponRequest,
	ApplyCouponResponse,
	RemoveCouponResponse,
	ValidateCouponRequest,
	ValidateCouponResponse,
} from "@/http/types";
import { handleApiError } from "@/lib/utils/handle-api-error";

export const useValidateCouponMutation = (options?: {
	onSuccess?: (data: ValidateCouponResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (
			data: ValidateCouponRequest,
		): Promise<ValidateCouponResponse> => {
			const response = await fetch("/api/coupons/validate", {
				method: "POST",
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.INVALID_COUPON_CODE);
			}

			return await response.json();
		},
		...options,
	});

export const useApplyCouponMutation = (options?: {
	onSuccess?: (data: ApplyCouponResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async ({
			orderId,
			code,
		}: ApplyCouponRequest & {
			orderId: string;
		}): Promise<ApplyCouponResponse> => {
			const response = await fetch(`/api/orders/${orderId}/apply-coupon`, {
				method: "POST",
				body: JSON.stringify({ code }),
			});

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.FAILED_TO_APPLY_COUPON);
			}

			return await response.json();
		},
		...options,
	});

export const useRemoveCouponMutation = (options?: {
	onSuccess?: (data: RemoveCouponResponse) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (orderId: string): Promise<RemoveCouponResponse> => {
			const response = await fetch(`/api/orders/${orderId}/remove-coupon`, {
				method: "DELETE",
			});

			if (!response.ok) {
				await handleApiError(response, ERROR_CODES.FAILED_TO_REMOVE_COUPON);
			}

			return await response.json();
		},
		...options,
	});
