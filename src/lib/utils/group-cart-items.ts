import type { GetCartResponse, GetOrderResponse } from "@/http/types";

// Define the cart item type that works for both cart and order contexts
type BaseCartItem = {
	id: string;
	groupId?: string | null;
	parentProductId?: string | null;
	quantity: number;
	product: {
		id: string;
		name: string;
		description?: string | null;
		slug: string | null;
		stock: number;
		images?: Array<{ imageUrl: string }>;
	};
	productPrice: {
		priceInCents: number;
		discountPercentage?: number | null;
	};
};

// Types for grouped items
export interface GroupedCartItem<T extends BaseCartItem = BaseCartItem> {
	glasses: T;
	lensOptions: T[];
	totalQuantity: number;
	combinationKey: string;
}

/**
 * Groups cart items by their groupId, handling glasses with their associated lens options
 * This function handles:
 * - Items with groupId (new grouping system)
 * - Legacy items without groupId (using parentProductId)
 * - Orphaned lens options
 */
export function groupCartItems<T extends BaseCartItem>(
	items: T[],
): GroupedCartItem<T>[] {
	const groupMap = new Map<string, GroupedCartItem<T>>();
	const processedItems = new Set<string>();

	// First pass: Process items with groupId
	items.forEach((item) => {
		// Skip if already processed
		if (processedItems.has(item.id)) return;

		// If this is a parent product (glasses) with a groupId
		if (!item.parentProductId && item.groupId) {
			const lensOptions = items.filter(
				(otherItem) =>
					otherItem.groupId === item.groupId && otherItem.parentProductId,
			);

			// Mark all items in this group as processed
			lensOptions.forEach((lensOption) => {
				processedItems.add(lensOption.id);
			});

			// Check if this group already exists (for quantity aggregation)
			if (groupMap.has(item.groupId)) {
				// Add to existing group
				const existing = groupMap.get(item.groupId);
				if (existing) {
					existing.totalQuantity += item.quantity;
				}
			} else {
				// Create new group
				groupMap.set(item.groupId, {
					glasses: item,
					lensOptions,
					totalQuantity: item.quantity,
					combinationKey: item.groupId,
				});
			}

			processedItems.add(item.id);
		}
		// Handle glasses without groupId (legacy data or orphaned items)
		else if (!item.parentProductId && !item.groupId) {
			const lensOptions = items.filter(
				(otherItem) =>
					otherItem.parentProductId === item.product.id && !otherItem.groupId,
			);

			// Mark lens options as processed
			lensOptions.forEach((lensOption) => {
				processedItems.add(lensOption.id);
			});

			const legacyKey = `legacy:${item.id}`;
			groupMap.set(legacyKey, {
				glasses: item,
				lensOptions,
				totalQuantity: item.quantity,
				combinationKey: legacyKey,
			});

			processedItems.add(item.id);
		}
	});

	// Handle any remaining orphaned lens options
	items.forEach((item) => {
		if (!processedItems.has(item.id) && item.parentProductId) {
			const orphanKey = `orphan:${item.id}`;
			groupMap.set(orphanKey, {
				glasses: item,
				lensOptions: [],
				totalQuantity: item.quantity,
				combinationKey: orphanKey,
			});
		}
	});

	return Array.from(groupMap.values());
}

/**
 * Type guard to check if an item is from a cart response
 */
export function isCartItem(item: unknown): item is GetCartResponse["items"][0] {
	return (
		typeof item === "object" &&
		item !== null &&
		"id" in item &&
		"product" in item &&
		"productPrice" in item
	);
}

/**
 * Type guard to check if an item is from an order response
 */
export function isOrderCartProduct(
	item: unknown,
): item is NonNullable<GetOrderResponse["order"]["cart"]>["cartProducts"][0] {
	return (
		typeof item === "object" &&
		item !== null &&
		"id" in item &&
		"product" in item
	);
}
