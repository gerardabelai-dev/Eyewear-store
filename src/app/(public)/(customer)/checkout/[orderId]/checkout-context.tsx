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
	isStepCompleted: (step: CheckoutStep) => boolean;
	isStepAccessible: (step: CheckoutStep) => boolean;
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
	// Start with null, will be set based on completion status
	const [activeStep, setActiveStep] = useState<CheckoutStep | null>(null);
	const [hasInitialized, setHasInitialized] = useState(false);

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
				// Focus the cardholder name input in the credit card form
				selector =
					'input[placeholder="João Silva"], input[placeholder="SEU NOME"]';
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

	const isStepCompleted = (step: CheckoutStep): boolean => {
		if (!order) return false;

		switch (step) {
			case "customer":
				// Completed if customer data exists
				return !!order.customerId;
			case "shipping-address":
				// Completed if customer address exists
				return !!order.customerAddressId;
			case "shipping-method":
				// Completed if delivery method is selected
				return !!order.delivery?.orderDeliveryMethodId;
			case "payment-method":
				// Completed if payment method is set up
				return !!(
					order.payment?.orderPaymentMethodId &&
					order.payment?.stripePaymentMethodId
				);
			default:
				return false;
		}
	};

	const isStepAccessible = (step: CheckoutStep): boolean => {
		if (!order) return step === "customer"; // Only customer step accessible initially

		const stepIndex = stepOrder.indexOf(step);

		// First step is always accessible
		if (stepIndex === 0) return true;

		// Check if all previous steps are completed
		for (let i = 0; i < stepIndex; i++) {
			if (!isStepCompleted(stepOrder[i])) {
				return false;
			}
		}

		return true;
	};

	const isStepDisabled = (step: CheckoutStep): boolean => {
		// Step is disabled if it's not accessible or if it's completed
		return !isStepAccessible(step);
	};

	// Initialize the active step based on completion status when order data loads
	useEffect(() => {
		if (!order || hasInitialized) return;

		// Find the first incomplete step
		let firstIncompleteStep: CheckoutStep | null = null;
		for (const step of stepOrder) {
			if (step === "complete") continue; // Skip the 'complete' pseudo-step

			if (!isStepCompleted(step) && isStepAccessible(step)) {
				firstIncompleteStep = step;
				break;
			}
		}

		// If all steps are completed, focus the order button
		if (!firstIncompleteStep) {
			setActiveStep(null); // Close all accordions
			// Give time for the UI to render before focusing
			setTimeout(() => focusOrderButton(), 300);
		} else {
			// Open the first incomplete step
			setActiveStep(firstIncompleteStep);
			// Focus the first input in that step
			setTimeout(() => focusFirstInput(firstIncompleteStep), 300);
		}

		setHasInitialized(true);
	}, [order, hasInitialized]);

	// Focus first input when customer form opens initially (for new customers)
	useEffect(() => {
		if (!hasCustomer && activeStep === "customer" && hasInitialized) {
			setTimeout(() => focusFirstInput("customer"), 100);
		}
	}, [hasCustomer, activeStep, hasInitialized]);

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
		// Don't allow setting inaccessible steps as active
		if (step && !isStepAccessible(step)) {
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
				isStepCompleted,
				isStepAccessible,
			}}
		>
			{children}
		</CheckoutContext.Provider>
	);
}
