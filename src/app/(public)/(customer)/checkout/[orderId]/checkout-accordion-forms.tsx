"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { type CheckoutStep, useCheckoutContext } from "./checkout-context";
import { CheckoutCustomerForm } from "./checkout-customer-form";
import { CheckoutPaymentMethodForm } from "./checkout-payment-method-form";
import { CheckoutShippingAddressForm } from "./checkout-shipping-address-form";
import { CheckoutShippingMethodForm } from "./checkout-shipping-method-form";

interface CheckoutAccordionFormsProps {
	orderId: string;
}

export function CheckoutAccordionForms({
	orderId,
}: CheckoutAccordionFormsProps) {
	const { activeStep, setActiveStep, isStepDisabled } = useCheckoutContext();

	return (
		<Accordion
			type="single"
			collapsible
			className="w-full space-y-4"
			value={activeStep || ""}
			onValueChange={(value) => setActiveStep(value as CheckoutStep | null)}
		>
			<AccordionItem
				value="customer"
				className={`border rounded-lg ${isStepDisabled("customer") ? "opacity-75" : ""}`}
			>
				<AccordionTrigger
					className="px-6 py-4 hover:no-underline"
					disabled={isStepDisabled("customer")}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
								isStepDisabled("customer")
									? "bg-primary text-primary-foreground"
									: "bg-primary/10"
							}`}
						>
							{isStepDisabled("customer") ? "✓" : "1"}
						</div>
						<div className="text-left">
							<div className="font-medium">Suas informações</div>
							<div className="text-sm text-muted-foreground">
								Nome, e-mail e telefone
							</div>
						</div>
					</div>
				</AccordionTrigger>
				<AccordionContent className="px-6 pb-6">
					<CheckoutCustomerForm orderId={orderId} />
				</AccordionContent>
			</AccordionItem>

			<AccordionItem
				value="shipping-address"
				className={`border rounded-lg ${isStepDisabled("shipping-address") ? "opacity-75" : ""}`}
			>
				<AccordionTrigger
					className="px-6 py-4 hover:no-underline"
					disabled={isStepDisabled("shipping-address")}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
								isStepDisabled("shipping-address")
									? "bg-primary text-primary-foreground"
									: "bg-primary/10"
							}`}
						>
							{isStepDisabled("shipping-address") ? "✓" : "2"}
						</div>
						<div className="text-left">
							<div className="font-medium">Endereço de entrega</div>
							<div className="text-sm text-muted-foreground">
								Onde devemos entregar seu pedido
							</div>
						</div>
					</div>
				</AccordionTrigger>
				<AccordionContent className="px-6 pb-6">
					<CheckoutShippingAddressForm orderId={orderId} />
				</AccordionContent>
			</AccordionItem>

			<AccordionItem
				value="shipping-method"
				className={`border rounded-lg ${isStepDisabled("shipping-method") ? "opacity-75" : ""}`}
			>
				<AccordionTrigger
					className="px-6 py-4 hover:no-underline"
					disabled={isStepDisabled("shipping-method")}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
								isStepDisabled("shipping-method")
									? "bg-primary text-primary-foreground"
									: "bg-primary/10"
							}`}
						>
							{isStepDisabled("shipping-method") ? "✓" : "3"}
						</div>
						<div className="text-left">
							<div className="font-medium">Método de envio</div>
							<div className="text-sm text-muted-foreground">
								Como você quer receber
							</div>
						</div>
					</div>
				</AccordionTrigger>
				<AccordionContent className="px-6 pb-6">
					<CheckoutShippingMethodForm orderId={orderId} />
				</AccordionContent>
			</AccordionItem>

			<AccordionItem
				value="payment-method"
				className={`border rounded-lg last:border-b ${isStepDisabled("payment-method") ? "opacity-75" : ""}`}
			>
				<AccordionTrigger
					className="px-6 py-4 hover:no-underline"
					disabled={isStepDisabled("payment-method")}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
								isStepDisabled("payment-method")
									? "bg-primary text-primary-foreground"
									: "bg-primary/10"
							}`}
						>
							{isStepDisabled("payment-method") ? "✓" : "4"}
						</div>
						<div className="text-left">
							<div className="font-medium">Método de pagamento</div>
							<div className="text-sm text-muted-foreground">
								Cartão de crédito
							</div>
						</div>
					</div>
				</AccordionTrigger>
				<AccordionContent className="px-6 pb-6">
					<CheckoutPaymentMethodForm
						orderId={orderId}
						stripePublishableKey={
							process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
						}
					/>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
