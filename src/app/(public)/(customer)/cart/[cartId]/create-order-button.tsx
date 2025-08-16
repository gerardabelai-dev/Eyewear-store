"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ERROR_CODES, ERROR_MESSAGES } from "@/app/api/contants/error-codes";
import { Button } from "@/components/ui/button";

export function CreateOrderButton({ cartId }: { cartId: string }) {
	const router = useRouter();

	// TODO: improve tanstack cache handling and optimistic ui updates
	const { mutate: createOrder, isPending } = useMutation({
		mutationFn: async () => {
			console.log("createOrder with cartId", cartId);
			const response = await fetch(`/api/orders/create-order-from-cart-id`, {
				method: "POST",
				body: JSON.stringify({ cartId }),
			});

			if (!response.ok) {
				console.error(response);
				throw new Error(ERROR_CODES.FAILED_TO_CREATE_ORDER);
			}

			return await response.json();
		},
		onSuccess: (data: { order: { id: string } }) => {
			router.push(`/checkout/${data.order.id}`);
		},
		onError: (error) => {
			console.error(error);
			switch (error.message) {
				case ERROR_CODES.FAILED_TO_CREATE_ORDER:
					toast.error(ERROR_MESSAGES[ERROR_CODES.FAILED_TO_CREATE_ORDER]);
					break;
				default:
					toast.error(ERROR_MESSAGES[ERROR_CODES.UNEXPECTED_ERROR]);
			}
		},
	});

	return (
		<Button
			variant="vibrant"
			className="w-full"
			size="lg"
			disabled={isPending}
			onClick={() => createOrder()}
		>
			{isPending ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				"Continuar para pagamento"
			)}
		</Button>
	);
}
