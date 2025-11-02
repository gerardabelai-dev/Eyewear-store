/**
 * Centralized route constants for the application
 * This ensures consistency across all route references
 */

export const ROUTES = {
	// Public routes
	HOME: "/",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",

	// Private admin routes
	ADMIN_CATEGORIES: "/admin/categorias",
	ADMIN_PRODUCTS: "/admin/produtos",
	ADMIN_ORDERS: "/admin/pedidos",
	ADMIN_CUSTOMERS: "/admin/clientes",
	ADMIN_ACTIVITIES: "/admin/atividades",

	// Private user routes
	CUSTOMER_PROFILE: "/minha-conta",
	CUSTOMER_ORDERS: "/meus-pedidos",

	// Customer routes
	CART: (cartId: string) => `/cart/${cartId}`,

	// API routes
	API: {
		AUTH: "/api/auth",
		SESSION: "/api/auth/session",
	},
} as const;

// Type for route values
export type RouteValue = (typeof ROUTES)[keyof typeof ROUTES];
