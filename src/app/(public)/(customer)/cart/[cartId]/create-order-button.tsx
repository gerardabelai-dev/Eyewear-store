"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCreateOrderFromCartMutation } from "@/http";

export function CreateOrderButton({
	cartId,
	disabled = false,
}: {
	cartId: string;
	disabled?: boolean;
}) {
	const router = useRouter();

	// TODO: improve tanstack cache handling and optimistic ui updates
	const { mutate: createOrder, isPending } = useCreateOrderFromCartMutation({
		onSuccess: (data) => {
			router.push(`/checkout/${data.order.id}`);
		},
		onError: (error) => {
			console.error(error);
			// Show the actual error message from the backend
			toast.error(error.message);
		},
	});

	return (
		<Button
			variant="vibrant"
			className="w-full"
			size="lg"
			disabled={isPending || disabled}
			onClick={() => createOrder({ cartId })}
		>
			{isPending ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				"Continuar para pagamento"
			)}
		</Button>
	);
}
