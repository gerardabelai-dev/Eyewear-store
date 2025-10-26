// Query Keys Factory
export const QUERY_KEYS = {
	// Cart
	cart: (cartId: string) => ["cart", { id: cartId }] as const,

	// Order
	order: (orderId: string) => ["order", { id: orderId }] as const,
	customerOrders: () => ["customer-orders"] as const,
	orderDelivery: (orderId: string) =>
		["order-delivery", { id: orderId }] as const,

	// Order Delivery Methods
	orderDeliveryMethods: () => ["orderDeliveryMethods"] as const,

	// Order Payment Methods
	orderPaymentMethods: () => ["orderPaymentMethods"] as const,

	// Product
	product: (productSlug: string) => ["product", { slug: productSlug }] as const,
} as const;
