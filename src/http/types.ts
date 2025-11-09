import type {
	Cart,
	CartProduct,
	Coupon,
	Customer,
	CustomerAddress,
	NewCustomer,
	NewCustomerAddress,
	Order,
	OrderDelivery,
	OrderDeliveryMethod,
	OrderPayment,
	OrderPaymentMethod,
	Product,
	ProductImage,
	ProductPrice,
	User,
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
export interface CreateCartResponse {
	cart: Cart;
}

export interface AddProductToCartRequest {
	productId: string;
	quantity?: number;
}

export interface AddProductToCartResponse {
	cartProduct: CartProduct;
}

export interface RemoveProductFromCartRequest {
	productId: string;
}

export interface RemoveProductFromCartResponse {
	success: boolean;
	message: string;
}

export interface UpdateCartProductQuantityRequest {
	productId: string;
	quantity: number;
}

export interface UpdateCartProductQuantityResponse {
	cartProduct: CartProduct;
}

export interface GetCartResponse extends Cart {
	items: Array<
		CartProduct & {
			product: Product & {
				images: ProductImage[];
				productPrice: ProductPrice;
			};
			productPrice: ProductPrice;
		}
	>;
}

// Order Types
export interface CreateOrderFromCartRequest {
	cartId: string;
}

export interface CreateOrderFromCartResponse {
	order: Pick<Order, "id">;
}

export interface GetOrderResponse {
	order: Order & {
		customer?: Customer & {
			user: Pick<User, "id" | "email" | "name">;
		};
		customerAddress?: CustomerAddress;
		cart?: Cart & {
			cartProducts: Array<
				CartProduct & {
					product: Product & {
						images: ProductImage[];
						productPrice: ProductPrice;
					};
					productPrice?: ProductPrice;
				}
			>;
		};
		delivery?: OrderDelivery & {
			orderDeliveryMethod: OrderDeliveryMethod;
		};
		payment?: OrderPayment & {
			orderPaymentMethod: OrderPaymentMethod;
			coupon?: Coupon | null;
		};
	};
}

export interface GetCustomerOrdersResponse {
	orders: Array<
		Order & {
			cart: Cart & {
				cartProducts: Array<
					CartProduct & {
						product: Product & {
							images: ProductImage[];
							productPrice: ProductPrice[];
						};
						productPrice: ProductPrice | null;
					}
				>;
			};
			delivery:
				| (OrderDelivery & {
						orderDeliveryMethod: OrderDeliveryMethod;
				  })
				| null;
			payment:
				| (OrderPayment & {
						orderPaymentMethod: OrderPaymentMethod;
						coupon?: Coupon | null;
				  })
				| null;
		}
	>;
}

// Customer Types
export interface GetCurrentCustomerResponse {
	customer: Customer & {
		email: string;
		role: string;
	};
}

export interface CreateCustomerRequest
	extends Pick<NewCustomer, "firstName" | "lastName" | "phoneNumber"> {
	email: string; // This comes from the user, not customer table
}

export interface CreateCustomerResponse {
	customer: Customer;
}

export interface UpdateCustomerRequest
	extends Pick<NewCustomer, "firstName" | "lastName" | "phoneNumber"> {
	customerId: string;
}

export interface UpdateCustomerResponse {
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
export interface CreateCustomerAddressRequest
	extends Omit<NewCustomerAddress, "customerId"> {
	orderId: string; // Used to associate with order during creation
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

export interface CreateOrderDeliveryRequest
	extends Pick<OrderDelivery, "orderId" | "orderDeliveryMethodId"> {}

export interface CreateOrderDeliveryResponse {
	orderDelivery: OrderDelivery;
}

export interface UpdateOrderDeliveryRequest
	extends Pick<OrderDelivery, "orderId" | "orderDeliveryMethodId"> {}

export interface UpdateOrderDeliveryResponse {
	orderDelivery: OrderDelivery;
}

// Order Payment Types
export interface ListOrderPaymentMethodsResponse {
	orderPaymentMethods: OrderPaymentMethod[];
}

export interface CreateOrderPaymentRequest
	extends Pick<OrderPayment, "orderId" | "orderPaymentMethodId"> {
	stripePaymentMethodId?: string;
}

export interface CreateOrderPaymentResponse {
	orderPayment: OrderPayment;
}

export interface UpdateOrderPaymentRequest
	extends Pick<OrderPayment, "orderId" | "orderPaymentMethodId"> {
	stripePaymentMethodId?: string;
}

export interface UpdateOrderPaymentResponse {
	orderPayment: OrderPayment;
}

// Stripe Types
export interface CreatePaymentIntentRequest {
	orderId: string;
}

export interface CreatePaymentIntentResponse {
	clientSecret: string;
	paymentIntentId: string;
}

export interface CreatePaymentMethodRequest {
	cardNumber: string;
	expiryMonth: number;
	expiryYear: number;
	cvc: string;
	cardholderName: string;
}

export interface CreatePaymentMethodResponse {
	paymentMethodId: string;
}

// Product Types
export interface GetProductBySlugResponse {
	product: Product & {
		productPrice: ProductPrice[];
		images: ProductImage[];
	};
}

// Coupon Types
export interface ValidateCouponRequest {
	code: string;
	subtotalInCents: number;
}

export interface ValidateCouponResponse {
	coupon: Pick<
		Coupon,
		"id" | "code" | "type" | "discountPercentage" | "discountAmountInCents"
	> & {
		discountInCents: number;
	};
}

export interface ApplyCouponRequest {
	code: string;
}

export interface ApplyCouponResponse {
	success: boolean;
	coupon: {
		id: string;
		code: string;
		discountInCents: number;
	};
	payment: {
		subtotalInCents: number;
		discountInCents: number;
		totalPriceInCents: number;
	};
}

export interface RemoveCouponResponse {
	success: boolean;
	payment: {
		subtotalInCents: number;
		discountInCents: number;
		totalPriceInCents: number;
	};
}
