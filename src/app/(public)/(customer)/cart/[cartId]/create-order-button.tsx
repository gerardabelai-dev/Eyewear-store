"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreateOrderButton({ cartId }: { cartId: string }) {
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
				throw new Error(`Failed to create order for cart ${cartId}`);
			}

			const data = await response.json();
			console.log(data);

			return data;
		},
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (error) => {
			console.error(error);
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
