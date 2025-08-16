export const ERROR_CODES = {
	// Generic
	UNEXPECTED_ERROR: "UNEXPECTED_ERROR",

	// Cart
	CART_NOT_FOUND: "CART_NOT_FOUND",
	FAILED_TO_GET_CART: "FAILED_TO_GET_CART",

	// Order
	FAILED_TO_CREATE_ORDER: "FAILED_TO_CREATE_ORDER",
	FAILED_TO_GET_ORDER_DETAILS: "FAILED_TO_GET_ORDER_DETAILS",
	FAILED_TO_UPDATE_ORDER: "FAILED_TO_UPDATE_ORDER",
	ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
	ORDER_ALREADY_HAS_CUSTOMER: "ORDER_ALREADY_HAS_CUSTOMER",
	ORDER_HAS_NO_CUSTOMER: "ORDER_HAS_NO_CUSTOMER",

	// User
	USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
	FAILED_TO_CREATE_USER: "FAILED_TO_CREATE_USER",

	// Customer
	FAILED_TO_CREATE_CUSTOMER: "FAILED_TO_CREATE_CUSTOMER",
	CUSTOMER_NOT_FOUND: "CUSTOMER_NOT_FOUND",

	// Customer Address
	FAILED_TO_CREATE_CUSTOMER_ADDRESS: "FAILED_TO_CREATE_CUSTOMER_ADDRESS",
	ORDER_ALREADY_HAS_CUSTOMER_ADDRESS: "ORDER_ALREADY_HAS_CUSTOMER_ADDRESS",
} as const;

export const ERROR_MESSAGES = {
	// Generic
	[ERROR_CODES.UNEXPECTED_ERROR]:
		"Não foi possível completar a ação, houve um erro inesperado",

	// Cart
	[ERROR_CODES.CART_NOT_FOUND]: "Carrinho não encontrado",
	[ERROR_CODES.FAILED_TO_GET_CART]:
		"Houve um erro ao buscar os detalhes carrinho",

	// Order
	[ERROR_CODES.FAILED_TO_CREATE_ORDER]: "Houve um erro ao criar o pedido",
	[ERROR_CODES.FAILED_TO_GET_ORDER_DETAILS]:
		"Houve um erro ao buscar os detalhes do pedido",
	[ERROR_CODES.FAILED_TO_UPDATE_ORDER]: "Houve um erro ao atualizar o pedido",
	[ERROR_CODES.ORDER_NOT_FOUND]: "Pedido não encontrado",
	[ERROR_CODES.ORDER_ALREADY_HAS_CUSTOMER]: "Pedido já possui um cliente",
	[ERROR_CODES.ORDER_HAS_NO_CUSTOMER]: "Pedido não possui um cliente",

	// User
	[ERROR_CODES.USER_ALREADY_EXISTS]: "Usuário com este e-mail já existe",
	[ERROR_CODES.FAILED_TO_CREATE_USER]: "Houve um erro ao criar o usuário",

	// Customer
	[ERROR_CODES.FAILED_TO_CREATE_CUSTOMER]: "Houve um erro ao criar o cliente",
	[ERROR_CODES.CUSTOMER_NOT_FOUND]: "Cliente não encontrado",

	// Customer Address
	[ERROR_CODES.FAILED_TO_CREATE_CUSTOMER_ADDRESS]:
		"Houve um erro ao criar o endereço do cliente",
	[ERROR_CODES.ORDER_ALREADY_HAS_CUSTOMER_ADDRESS]:
		"Pedido já possui um endereço de cliente",
} as const;
