"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { SignInDialog } from "@/components/sign-in-dialog";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputMask } from "@/components/ui/input-mask";
import {
	getOrderByIdQueryOptions,
	useCreateCustomerMutation,
	useUpdateCustomerMutation,
	useUpdateOrderCustomerIdMutation,
} from "@/http";
import { useCheckoutContext } from "./checkout-context";

const formSchema = z.object({
	customer: z.object({
		fullName: z
			.string()
			.min(2, "Nome é obrigatório")
			.refine(
				(value) => {
					const words = value.trim().split(/\s+/);
					return words.length >= 2;
				},
				{
					message: "Informe seu nome e sobrenome",
				},
			),
		email: z.email(),
		phone: z.string().min(1),
	}),
});

type CustomerFormValues = z.infer<typeof formSchema>;

interface CheckoutCustomerFormProps {
	orderId: string;
}

export function CheckoutCustomerForm({ orderId }: CheckoutCustomerFormProps) {
	const queryClient = useQueryClient();
	const { goToNextStep, authenticatedCustomer } = useCheckoutContext();
	const [showSignInDialog, setShowSignInDialog] = useState(false);
	const [existingEmail, setExistingEmail] = useState("");
	const [isCheckingEmail, setIsCheckingEmail] = useState(false);

	const form = useForm<CustomerFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			customer: {
				fullName: "",
				email: "",
				phone: "",
			},
		},
	});

	const { data: order } = useQuery(getOrderByIdQueryOptions(orderId));

	// Watch email field for changes
	const emailValue = form.watch("customer.email");

	// Check if email exists when valid email is entered
	useEffect(() => {
		const checkEmailExists = async () => {
			// Only check if email is valid and not already authenticated
			if (!emailValue || authenticatedCustomer) return;

			// Validate email format using zod
			const emailSchema = z.string().email();
			const result = emailSchema.safeParse(emailValue);

			if (!result.success) return;

			setIsCheckingEmail(true);

			try {
				const response = await fetch("/api/auth/check-email", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: emailValue }),
				});

				const data = await response.json();

				if (data.exists) {
					setExistingEmail(emailValue);
					setShowSignInDialog(true);
				}
			} catch (error) {
				console.error("Error checking email:", error);
			} finally {
				setIsCheckingEmail(false);
			}
		};

		// Debounce the email check
		const timeoutId = setTimeout(checkEmailExists, 500);

		return () => clearTimeout(timeoutId);
	}, [emailValue, authenticatedCustomer]);

	const createCustomerMutation = useCreateCustomerMutation({
		onSuccess: (data) => {
			// Update order with customer id
			updateOrderCustomerIdMutation.mutate({
				orderId,
				customerId: data.customer.id,
			});
		},
		onError: (error) => {
			console.error(error);
			// Check if the error is USER_ALREADY_EXISTS
			if (error.message.includes("Usuário com este e-mail já existe")) {
				setExistingEmail(form.getValues("customer.email"));
				setShowSignInDialog(true);
			} else {
				// Show the actual error message from the backend
				toast.error(error.message);
			}
		},
	});

	const updateCustomerMutation = useUpdateCustomerMutation({
		onSuccess: (data) => {
			// Update order with customer id
			updateOrderCustomerIdMutation.mutate({
				orderId,
				customerId: data.customer.id,
			});
		},
		onError: (error) => {
			console.error(error);
			toast.error(error.message);
		},
	});

	const updateOrderCustomerIdMutation = useUpdateOrderCustomerIdMutation({
		onSuccess: (data) => {
			console.log(data);
			// Invalidate order query to refresh checkout button state
			queryClient.invalidateQueries(getOrderByIdQueryOptions(orderId));
			// Move to next step after successful submission
			goToNextStep("customer");
		},
		onError: (error) => {
			console.error(error);
			// Show the actual error message from the backend
			toast.error(error.message);
		},
	});

	const isPending =
		createCustomerMutation.isPending ||
		updateCustomerMutation.isPending ||
		updateOrderCustomerIdMutation.isPending;

	// Pre-fill form with authenticated customer data
	useEffect(() => {
		if (authenticatedCustomer) {
			form.setValue(
				"customer.fullName",
				`${authenticatedCustomer.firstName} ${authenticatedCustomer.lastName}`,
			);
			form.setValue("customer.email", authenticatedCustomer.userEmail);
			form.setValue("customer.phone", authenticatedCustomer.phoneNumber || "");
		} else if (order?.customer && order.customer.user) {
			form.setValue(
				"customer.fullName",
				`${order.customer.firstName} ${order.customer.lastName}`,
			);
			form.setValue("customer.email", order.customer.user.email);
			form.setValue("customer.phone", order.customer.phoneNumber || "");
		}
	}, [authenticatedCustomer, order, form]);

	function onSubmit(values: CustomerFormValues) {
		const [firstName, ...lastNameParts] = values.customer.fullName.split(" ");
		const lastName = lastNameParts.join(" ");

		if (authenticatedCustomer) {
			// Update existing customer
			updateCustomerMutation.mutate({
				customerId: authenticatedCustomer.id,
				firstName,
				lastName,
				phoneNumber: values.customer.phone,
			});
		} else {
			// Create new user and customer
			createCustomerMutation.mutate({
				firstName,
				lastName,
				email: values.customer.email,
				phoneNumber: values.customer.phone,
			});
		}
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Email field - first */}
					<FormField
						control={form.control}
						name="customer.email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Seu melhor e-mail</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											placeholder="victor@email.com"
											type="email"
											autoComplete="email"
										/>
										{isCheckingEmail && (
											<Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
										)}
									</div>
								</FormControl>
								<FormDescription>
									Enviaremos e-mails com atualizações do seu pedido
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Full name field - second */}
					<FormField
						control={form.control}
						name="customer.fullName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Seu nome completo</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="Victor Nogueira"
										autoComplete="name"
									/>
								</FormControl>
								<FormDescription>Como devemos te chamar?</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Phone field - third */}
					<FormField
						control={form.control}
						name="customer.phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>WhatsApp</FormLabel>
								<FormControl>
									<InputMask
										{...field}
										mask="(99) 99999-9999"
										maskOptions={{
											placeholder: "",
											showMaskOnHover: false,
										}}
										placeholder="(11) 99999-9999"
									/>
								</FormControl>
								<FormDescription>
									Caso algum problema ocorra, entraremos em contato por aqui
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isPending} className="w-full">
						{isPending ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							"Continuar"
						)}
					</Button>
				</form>
			</Form>

			<SignInDialog
				open={showSignInDialog}
				onOpenChange={setShowSignInDialog}
				email={existingEmail}
				orderId={orderId}
			/>
		</>
	);
}
