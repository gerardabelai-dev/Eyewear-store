import type {
	Customer,
	CustomerAddress,
	Order,
	OrderDelivery,
	OrderDeliveryMethod,
	OrderPayment,
	OrderPaymentMethod,
} from "@/lib/db/schema";

// API Response Types
export interface ApiResponse<T> {
	data?: T;
	error?: {
		code: string;
		message: string;
	};
}

// Cart Types
export interface GetCartResponse {
	id: string;
	items: Array<{
		id: string;
		quantity: number;
		product: {
			id: string;
			name: string;
			description: string;
			productPrice: {
				id: string;
				price: number;
				currency: string;
			};
			images: Array<{
				id: string;
				url: string;
				alt: string;
			}>;
		};
		productPrice: {
			id: string;
			price: number;
			currency: string;
		};
	}>;
	createdAt: Date;
	updatedAt: Date;
}

// Order Types
export interface CreateOrderFromCartRequest {
	cartId: string;
}

export interface CreateOrderFromCartResponse {
	order: {
		id: string;
	};
}

export interface GetOrderResponse {
	order: Order & {
		customer?: Customer & {
			user: {
				id: string;
				email: string;
				name: string;
			};
		};
		customerAddress?: CustomerAddress;
		cartProducts?: Array<{
			id: string;
			quantity: number;
			product: {
				id: string;
				name: string;
				description: string;
				productPrice: {
					id: string;
					price: number;
					currency: string;
				};
			};
		}>;
		delivery?: OrderDelivery & {
			orderDeliveryMethod: OrderDeliveryMethod;
		};
		payment?: OrderPayment & {
			orderPaymentMethod: OrderPaymentMethod;
		};
	};
}

// Customer Types
export interface CreateCustomerRequest {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
}

export interface CreateCustomerResponse {
	customer: Customer;
}

export interface UpdateOrderCustomerIdRequest {
	orderId: string;
	customerId: string;
}

export interface UpdateOrderCustomerIdResponse {
	order: Order;
}

// Customer Address Types
export interface CreateCustomerAddressRequest {
	orderId: string;
	street: string;
	number: string;
	complement: string;
	neighborhood: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	isDefault: boolean;
}

export interface CreateCustomerAddressResponse {
	customerAddress: CustomerAddress;
}

export interface UpdateOrderCustomerAddressIdRequest {
	orderId: string;
	customerAddressId: string;
}

export interface UpdateOrderCustomerAddressIdResponse {
	order: Order;
}

// Order Delivery Types
export interface GetOrderDeliveryResponse {
	orderDelivery: OrderDelivery & {
		order: Order;
		orderDeliveryMethod: OrderDeliveryMethod;
	};
}

export interface ListOrderDeliveryMethodsResponse {
	orderDeliveryMethods: OrderDeliveryMethod[];
}

export interface CreateOrderDeliveryRequest {
	orderId: string;
	orderDeliveryMethodId: string;
}

export interface CreateOrderDeliveryResponse {
	orderDelivery: OrderDelivery;
}

// Order Payment Types
export interface ListOrderPaymentMethodsResponse {
	orderPaymentMethods: OrderPaymentMethod[];
}

export interface CreateOrderPaymentRequest {
	orderId: string;
	orderPaymentMethodId: string;
}

export interface CreateOrderPaymentResponse {
	orderPayment: OrderPayment;
}
