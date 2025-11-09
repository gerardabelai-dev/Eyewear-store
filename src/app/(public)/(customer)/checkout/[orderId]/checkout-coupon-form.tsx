"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApplyCouponMutation, useRemoveCouponMutation } from "@/http";

const formSchema = z.object({
	coupon: z.object({
		code: z.string().min(1, "Digite um código de cupom"),
	}),
});

interface CheckoutCouponFormProps {
	orderId: string;
	appliedCouponCode?: string | null;
	onCouponApplied?: () => void;
}

export function CheckoutCouponForm({
	orderId,
	appliedCouponCode,
	onCouponApplied,
}: CheckoutCouponFormProps) {
	const [appliedCoupon, setAppliedCoupon] = useState<string | null>(
		appliedCouponCode || null,
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			coupon: {
				code: "",
			},
		},
	});

	const applyCouponMutation = useApplyCouponMutation({
		onSuccess: (data) => {
			setAppliedCoupon(data.coupon.code);
			form.reset();
			toast.success("Cupom aplicado com sucesso!");
			onCouponApplied?.();
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao aplicar cupom");
		},
	});

	const removeCouponMutation = useRemoveCouponMutation({
		onSuccess: () => {
			setAppliedCoupon(null);
			toast.success("Cupom removido");
			onCouponApplied?.();
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao remover cupom");
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		applyCouponMutation.mutate({
			orderId,
			code: values.coupon.code.toUpperCase(),
		});
	}

	function handleRemoveCoupon() {
		removeCouponMutation.mutate(orderId);
	}

	if (appliedCoupon) {
		return (
			<Card className="space-y-4 bg-transparent border-none shadow-none">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Check className="size-4 text-emerald-600" />
						<span className="text-sm text-muted-foreground">
							Cupom{" "}
							<strong className="text-foreground font-bold">
								{appliedCoupon}
							</strong>{" "}
							aplicado
						</span>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleRemoveCoupon}
						disabled={removeCouponMutation.isPending}
					>
						<X className="size-4" />
						Remover
					</Button>
				</div>
			</Card>
		);
	}

	return (
		<Card className="space-y-4 bg-transparent border-none shadow-none">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="grid grid-cols-2 gap-4 items-start"
				>
					<FormField
						control={form.control}
						name="coupon.code"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cupom</FormLabel>
								<FormControl>
									<Input {...field} placeholder="ABC123" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormItem>
						<FormLabel className="invisible">Cupom</FormLabel>
						<FormControl>
							<Button type="submit" disabled={applyCouponMutation.isPending}>
								{applyCouponMutation.isPending
									? "Aplicando..."
									: "Aplicar Cupom"}
							</Button>
						</FormControl>
						<FormMessage className="invisible" />
					</FormItem>
				</form>
			</Form>
		</Card>
	);
}
