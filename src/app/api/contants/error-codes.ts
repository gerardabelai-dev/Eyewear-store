export const ERROR_CODES = {
	CART_NOT_FOUND: "CART_NOT_FOUND",
	ORDER_NOT_CREATED: "ORDER_NOT_CREATED",
} as const;

export const ERROR_MESSAGES = {
	[ERROR_CODES.CART_NOT_FOUND]: "Carrinho não encontrado",
	[ERROR_CODES.ORDER_NOT_CREATED]: "Houve um erro ao criar o pedido",
} as const;
