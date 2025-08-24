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
	const { activeStep, setActiveStep, isStepCompleted, isStepAccessible } =
		useCheckoutContext();

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
				className={`border rounded-lg ${!isStepAccessible("customer") ? "opacity-50" : ""}`}
			>
				<AccordionTrigger
					className="px-6 py-4 hover:no-underline"
					disabled={!isStepAccessible("customer")}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
								isStepCompleted("customer")
									? "bg-primary text-primary-foreground"
									: isStepAccessible("customer")
										? "bg-primary/10 text-primary"
										: "bg-muted text-muted-foreground"
							}`}
						>
							{isStepCompleted("customer") ? "✓" : "1"}
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
				className={`border rounded-lg ${!isStepAccessible("shipping-address") ? "opacity-50" : ""}`}
			>
				<AccordionTrigger
					className="px-6 py-4 hover:no-underline"
					disabled={!isStepAccessible("shipping-address")}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
								isStepCompleted("shipping-address")
									? "bg-primary text-primary-foreground"
									: isStepAccessible("shipping-address")
										? "bg-primary/10 text-primary"
										: "bg-muted text-muted-foreground"
							}`}
						>
							{isStepCompleted("shipping-address") ? "✓" : "2"}
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
				className={`border rounded-lg ${!isStepAccessible("shipping-method") ? "opacity-50" : ""}`}
			>
				<AccordionTrigger
					className="px-6 py-4 hover:no-underline"
					disabled={!isStepAccessible("shipping-method")}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
								isStepCompleted("shipping-method")
									? "bg-primary text-primary-foreground"
									: isStepAccessible("shipping-method")
										? "bg-primary/10 text-primary"
										: "bg-muted text-muted-foreground"
							}`}
						>
							{isStepCompleted("shipping-method") ? "✓" : "3"}
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
					{isStepAccessible("shipping-method") ? (
						<CheckoutShippingMethodForm orderId={orderId} />
					) : (
						<div className="text-muted-foreground text-sm">
							Complete as etapas anteriores para acessar o método de envio
						</div>
					)}
				</AccordionContent>
			</AccordionItem>

			<AccordionItem
				value="payment-method"
				className={`border rounded-lg last:border-b ${!isStepAccessible("payment-method") ? "opacity-50" : ""}`}
			>
				<AccordionTrigger
					className="px-6 py-4 hover:no-underline"
					disabled={!isStepAccessible("payment-method")}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
								isStepCompleted("payment-method")
									? "bg-primary text-primary-foreground"
									: isStepAccessible("payment-method")
										? "bg-primary/10 text-primary"
										: "bg-muted text-muted-foreground"
							}`}
						>
							{isStepCompleted("payment-method") ? "✓" : "4"}
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
					{isStepAccessible("payment-method") ? (
						<CheckoutPaymentMethodForm
							orderId={orderId}
							stripePublishableKey={
								process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
							}
						/>
					) : (
						<div className="text-muted-foreground text-sm">
							Complete as etapas anteriores para acessar o pagamento
						</div>
					)}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
