/**
 * Centralized activity constants for the application
 * This ensures consistency across all activity type references
 */

// Activity entity types
export const ACTIVITY_ENTITIES = {
	CUSTOMER: "customer",
	ORDER: "order",
	PRODUCT: "product",
	CATEGORY: "category",
	ORDER_PAYMENT: "orderPayment",
	ORDER_DELIVERY: "orderDelivery",
	CUSTOMER_ADDRESS: "customerAddress",
	PRODUCT_IMAGE: "productImage",
	PRODUCT_PRICE: "productPrice",
	CATEGORY_SECONDARY: "categorySecondary",
	CART_PRODUCT: "cartProduct",
} as const;

// Activity action types
export const ACTIVITY_ACTIONS = {
	CREATED: "created",
	UPDATED: "updated",
	DELETED: "deleted",
	PAID: "paid",
	FAILED: "failed",
	CANCELLED: "cancelled",
	SHIPPED: "shipped",
	DELIVERED: "delivered",
} as const;

// Entity names in Portuguese
export const ENTITY_NAMES: Record<string, string> = {
	[ACTIVITY_ENTITIES.CUSTOMER]: "cliente",
	[ACTIVITY_ENTITIES.ORDER]: "pedido",
	[ACTIVITY_ENTITIES.PRODUCT]: "produto",
	[ACTIVITY_ENTITIES.CATEGORY]: "categoria",
	[ACTIVITY_ENTITIES.ORDER_DELIVERY]: "entrega",
	[ACTIVITY_ENTITIES.ORDER_PAYMENT]: "pagamento",
	[ACTIVITY_ENTITIES.CUSTOMER_ADDRESS]: "endereço",
	[ACTIVITY_ENTITIES.PRODUCT_IMAGE]: "imagem de produto",
	[ACTIVITY_ENTITIES.PRODUCT_PRICE]: "preço",
	[ACTIVITY_ENTITIES.CATEGORY_SECONDARY]: "subcategoria",
	[ACTIVITY_ENTITIES.CART_PRODUCT]: "item do pedido",
};

// Contextual action text for natural language activities
export const CONTEXTUAL_ACTIONS: Record<string, string> = {
	// Payment actions
	[`${ACTIVITY_ENTITIES.ORDER_PAYMENT}.${ACTIVITY_ACTIONS.CREATED}`]:
		"iniciou um pagamento",
	[`${ACTIVITY_ENTITIES.ORDER_PAYMENT}.${ACTIVITY_ACTIONS.UPDATED}`]:
		"atualizou o pagamento",
	[`${ACTIVITY_ENTITIES.ORDER_PAYMENT}.${ACTIVITY_ACTIONS.PAID}`]:
		"realizou um pagamento",
	[`${ACTIVITY_ENTITIES.ORDER_PAYMENT}.${ACTIVITY_ACTIONS.FAILED}`]:
		"falhou o pagamento",

	// Order actions
	[`${ACTIVITY_ENTITIES.ORDER}.${ACTIVITY_ACTIONS.CREATED}`]: "criou o pedido",
	[`${ACTIVITY_ENTITIES.ORDER}.${ACTIVITY_ACTIONS.UPDATED}`]:
		"atualizou o pedido",
	[`${ACTIVITY_ENTITIES.ORDER}.${ACTIVITY_ACTIONS.CANCELLED}`]:
		"cancelou o pedido",

	// Delivery actions
	[`${ACTIVITY_ENTITIES.ORDER_DELIVERY}.${ACTIVITY_ACTIONS.CREATED}`]:
		"iniciou a entrega",
	[`${ACTIVITY_ENTITIES.ORDER_DELIVERY}.${ACTIVITY_ACTIONS.UPDATED}`]:
		"atualizou a entrega",
	[`${ACTIVITY_ENTITIES.ORDER_DELIVERY}.${ACTIVITY_ACTIONS.SHIPPED}`]:
		"enviou a entrega",
	[`${ACTIVITY_ENTITIES.ORDER_DELIVERY}.${ACTIVITY_ACTIONS.DELIVERED}`]:
		"entregou o pedido",

	// Customer actions
	[`${ACTIVITY_ENTITIES.CUSTOMER}.${ACTIVITY_ACTIONS.CREATED}`]:
		"realizou cadastro",
	[`${ACTIVITY_ENTITIES.CUSTOMER}.${ACTIVITY_ACTIONS.UPDATED}`]:
		"atualizou o cliente",

	// Address actions
	[`${ACTIVITY_ENTITIES.CUSTOMER_ADDRESS}.${ACTIVITY_ACTIONS.CREATED}`]:
		"adicionou o endereço",
	[`${ACTIVITY_ENTITIES.CUSTOMER_ADDRESS}.${ACTIVITY_ACTIONS.UPDATED}`]:
		"atualizou o endereço",
	[`${ACTIVITY_ENTITIES.CUSTOMER_ADDRESS}.${ACTIVITY_ACTIONS.DELETED}`]:
		"removeu o endereço",

	// Product actions
	[`${ACTIVITY_ENTITIES.PRODUCT}.${ACTIVITY_ACTIONS.CREATED}`]:
		"cadastrou o produto",
	[`${ACTIVITY_ENTITIES.PRODUCT}.${ACTIVITY_ACTIONS.UPDATED}`]:
		"atualizou o produto",
	[`${ACTIVITY_ENTITIES.PRODUCT}.${ACTIVITY_ACTIONS.DELETED}`]:
		"removeu o produto",

	// Category actions
	[`${ACTIVITY_ENTITIES.CATEGORY}.${ACTIVITY_ACTIONS.CREATED}`]:
		"criou a categoria",
	[`${ACTIVITY_ENTITIES.CATEGORY}.${ACTIVITY_ACTIONS.UPDATED}`]:
		"atualizou a categoria",
	[`${ACTIVITY_ENTITIES.CATEGORY}.${ACTIVITY_ACTIONS.DELETED}`]:
		"removeu a categoria",

	// Product image actions
	[`${ACTIVITY_ENTITIES.PRODUCT_IMAGE}.${ACTIVITY_ACTIONS.CREATED}`]:
		"adicionou a imagem",
	[`${ACTIVITY_ENTITIES.PRODUCT_IMAGE}.${ACTIVITY_ACTIONS.DELETED}`]:
		"removeu a imagem",

	// Product price actions
	[`${ACTIVITY_ENTITIES.PRODUCT_PRICE}.${ACTIVITY_ACTIONS.CREATED}`]:
		"definiu o preço",
	[`${ACTIVITY_ENTITIES.PRODUCT_PRICE}.${ACTIVITY_ACTIONS.UPDATED}`]:
		"alterou o preço",

	// Secondary category actions
	[`${ACTIVITY_ENTITIES.CATEGORY_SECONDARY}.${ACTIVITY_ACTIONS.CREATED}`]:
		"criou a subcategoria",
	[`${ACTIVITY_ENTITIES.CATEGORY_SECONDARY}.${ACTIVITY_ACTIONS.UPDATED}`]:
		"atualizou a subcategoria",
	[`${ACTIVITY_ENTITIES.CATEGORY_SECONDARY}.${ACTIVITY_ACTIONS.DELETED}`]:
		"removeu a subcategoria",

	// Order product actions
	[`${ACTIVITY_ENTITIES.CART_PRODUCT}.${ACTIVITY_ACTIONS.CREATED}`]:
		"adicionou o item",
	[`${ACTIVITY_ENTITIES.CART_PRODUCT}.${ACTIVITY_ACTIONS.UPDATED}`]:
		"atualizou o item",
	[`${ACTIVITY_ENTITIES.CART_PRODUCT}.${ACTIVITY_ACTIONS.DELETED}`]:
		"removeu o item",
};

// Generic action text fallbacks
export const GENERIC_ACTIONS: Record<string, string> = {
	[ACTIVITY_ACTIONS.CREATED]: "criou",
	[ACTIVITY_ACTIONS.UPDATED]: "atualizou",
	[ACTIVITY_ACTIONS.DELETED]: "removeu",
};

// Type definitions
export type ActivityEntity =
	(typeof ACTIVITY_ENTITIES)[keyof typeof ACTIVITY_ENTITIES];
export type ActivityAction =
	(typeof ACTIVITY_ACTIONS)[keyof typeof ACTIVITY_ACTIONS];
export type ActivityType = `${ActivityEntity}.${ActivityAction}`;

// Helper function to build activity type
export function buildActivityType(
	entity: ActivityEntity,
	action: ActivityAction,
): ActivityType {
	return `${entity}.${action}`;
}

// Helper function to parse activity type
export function parseActivityType(type: string): {
	entity: string;
	action: string;
} {
	const [entity, action] = type.split(".");
	return { entity: entity || "unknown", action: action || "unknown" };
}

// Helper function to get contextual action text
export function getContextualActionText(
	entity: string,
	action: string,
): string {
	const key = `${entity}.${action}`;
	return CONTEXTUAL_ACTIONS[key] || getGenericActionText(entity, action);
}

// Helper function to get generic action text
export function getGenericActionText(entity: string, action: string): string {
	const entityName = ENTITY_NAMES[entity] || entity;
	const actionText = GENERIC_ACTIONS[action] || action;
	return `${actionText} ${entityName === "cliente" ? "um novo" : "uma nova"} ${entityName}`;
}
