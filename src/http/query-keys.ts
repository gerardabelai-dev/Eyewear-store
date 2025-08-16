// Query Keys Factory
export const queryKeys = {
	// Cart
	cart: (cartId: string) => ["cart", { id: cartId }] as const,

	// Order
	order: (orderId: string) => ["order", { id: orderId }] as const,
	orderDelivery: (orderId: string) =>
		["order-delivery", { id: orderId }] as const,

	// Order Delivery Methods
	orderDeliveryMethods: () => ["orderDeliveryMethods"] as const,

	// Order Payment Methods
	orderPaymentMethods: () => ["orderPaymentMethods"] as const,
} as const;
