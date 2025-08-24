"use client";

import { useQuery } from "@tanstack/react-query";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { getOrderByIdQueryOptions } from "@/http";

export type CheckoutStep =
	| "customer"
	| "shipping-address"
	| "shipping-method"
	| "payment-method"
	| "complete";

interface CheckoutContextType {
	activeStep: CheckoutStep | null;
	setActiveStep: (step: CheckoutStep | null) => void;
	goToNextStep: (currentStep: CheckoutStep) => void;
	focusFirstInput: (step: CheckoutStep) => void;
	focusOrderButton: () => void;
	isStepDisabled: (step: CheckoutStep) => boolean;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function useCheckoutContext() {
	const context = useContext(CheckoutContext);
	if (!context) {
		throw new Error("useCheckoutContext must be used within CheckoutProvider");
	}
	return context;
}

interface CheckoutProviderProps {
	children: ReactNode;
	hasCustomer: boolean;
	orderId: string;
}

const stepOrder: CheckoutStep[] = [
	"customer",
	"shipping-address",
	"shipping-method",
	"payment-method",
	"complete",
];

export function CheckoutProvider({
	children,
	hasCustomer,
	orderId,
}: CheckoutProviderProps) {
	// Start with customer form open if no customer, otherwise all closed
	const [activeStep, setActiveStep] = useState<CheckoutStep | null>(
		hasCustomer ? null : "customer",
	);

	// Get order data to check which steps should be disabled
	const { data: order } = useQuery(getOrderByIdQueryOptions(orderId));

	const focusFirstInput = (step: CheckoutStep) => {
		let selector = "";

		switch (step) {
			case "customer":
				selector = 'input[name="customer.fullName"]';
				break;
			case "shipping-address":
				selector = 'input[name="address.street"]';
				break;
			case "shipping-method":
				selector = 'button[role="combobox"]'; // Select trigger
				break;
			case "payment-method":
				selector = '[data-value="payment-method"] input[type="text"]'; // First text input in payment method accordion
				break;
		}

		if (selector) {
			const element = document.querySelector(selector) as HTMLElement;
			if (element) {
				element.focus();
			}
		}
	};

	const focusOrderButton = () => {
		const button = document.querySelector(
			"[data-checkout-order-button]",
		) as HTMLElement;
		if (button) {
			button.focus();
		}
	};

	const isStepDisabled = (step: CheckoutStep): boolean => {
		if (!order) return false; // Don't disable if order data is not loaded yet

		switch (step) {
			case "customer":
				// Disable if customer data exists (has customer and customer address)
				return !!(order.customerId && order.customerAddressId);
			case "shipping-address":
				// Disable if customer address exists
				return !!order.customerAddressId;
			case "shipping-method":
				// Disable if delivery method is selected
				return !!order.delivery?.orderDeliveryMethodId;
			case "payment-method":
				// Disable if payment method is set up (has payment method and stripe payment method)
				return !!(
					order.payment?.orderPaymentMethodId &&
					order.payment?.stripePaymentMethodId
				);
			default:
				return false;
		}
	};

	// Focus first input when customer form opens initially
	useEffect(() => {
		if (!hasCustomer && activeStep === "customer") {
			setTimeout(() => focusFirstInput("customer"), 100);
		}
	}, [hasCustomer, activeStep]);

	const goToNextStep = (currentStep: CheckoutStep) => {
		const currentIndex = stepOrder.indexOf(currentStep);
		const nextStep = stepOrder[currentIndex + 1];

		// Scroll to top of page after form submission
		window.scrollTo({ top: 0, behavior: "smooth" });

		if (nextStep === "complete") {
			// All forms completed, close all accordions
			setActiveStep(null);
			// Focus will be handled by focusOrderButton with longer delay to ensure re-renders complete
			setTimeout(() => focusOrderButton(), 200);
		} else if (nextStep) {
			setActiveStep(nextStep);
			// Focus first input of next form
			setTimeout(() => focusFirstInput(nextStep), 100);
		}
	};

	const handleSetActiveStep = (step: CheckoutStep | null) => {
		// Don't allow setting disabled steps as active
		if (step && isStepDisabled(step)) {
			return;
		}
		setActiveStep(step);
	};

	return (
		<CheckoutContext.Provider
			value={{
				activeStep,
				setActiveStep: handleSetActiveStep,
				goToNextStep,
				focusFirstInput,
				focusOrderButton,
				isStepDisabled,
			}}
		>
			{children}
		</CheckoutContext.Provider>
	);
}
