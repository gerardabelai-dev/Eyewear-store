/**
 * Formats a price in cents to Brazilian Real currency format
 */
export function formatPrice(priceInCents: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(priceInCents / 100);
}

/**
 * Calculates the discounted price for a product
 */
export function calculateDiscountedPrice(
	priceInCents: number,
	discountPercentage: number,
): number {
	return priceInCents * (1 - discountPercentage / 100);
}
