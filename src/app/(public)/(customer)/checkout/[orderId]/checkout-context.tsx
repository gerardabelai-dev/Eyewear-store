"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

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
}: CheckoutProviderProps) {
	// Start with customer form open if no customer, otherwise all closed
	const [activeStep, setActiveStep] = useState<CheckoutStep | null>(
		hasCustomer ? null : "customer",
	);

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
				selector = 'input[name="cardNumber"]'; // Stripe card number input
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

	return (
		<CheckoutContext.Provider
			value={{
				activeStep,
				setActiveStep,
				goToNextStep,
				focusFirstInput,
				focusOrderButton,
			}}
		>
			{children}
		</CheckoutContext.Provider>
	);
}
