export const ERROR_CODES = {
	CART_NOT_FOUND: "CART_NOT_FOUND",
	FAILED_TO_GET_CART: "FAILED_TO_GET_CART",
	FAILED_TO_CREATE_ORDER: "FAILED_TO_CREATE_ORDER",
	FAILED_TO_GET_CHECKOUT: "FAILED_TO_GET_CHECKOUT",
} as const;

export const ERROR_MESSAGES = {
	[ERROR_CODES.CART_NOT_FOUND]: "Carrinho não encontrado",
	[ERROR_CODES.FAILED_TO_CREATE_ORDER]: "Houve um erro ao criar o pedido",
	[ERROR_CODES.FAILED_TO_GET_CART]:
		"Houve um erro ao buscar os detalhes carrinho",
	[ERROR_CODES.FAILED_TO_GET_CHECKOUT]:
		"Houve um erro ao buscar os detalhes do checkout",
} as const;
