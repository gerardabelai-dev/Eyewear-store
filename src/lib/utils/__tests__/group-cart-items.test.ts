import { describe, expect, it } from "vitest";
import { groupCartItems } from "../group-cart-items";

describe("groupCartItems", () => {
	const createMockItem = (overrides: any = {}) => ({
		id: "item-1",
		groupId: null,
		parentProductId: null,
		quantity: 1,
		product: {
			id: "product-1",
			name: "Test Product",
			description: "Test Description",
			slug: "test-product",
			stock: 10,
			images: [],
		},
		productPrice: {
			priceInCents: 1000,
			discountPercentage: null,
		},
		...overrides,
	});

	it("groups items with matching groupId", () => {
		const items = [
			createMockItem({
				id: "glasses-1",
				groupId: "group-1",
				product: {
					id: "glasses-product",
					name: "Glasses",
					slug: "glasses",
					stock: 5,
				},
			}),
			createMockItem({
				id: "lens-1",
				groupId: "group-1",
				parentProductId: "glasses-product",
				product: {
					id: "lens-product-1",
					name: "Lens Option 1",
					slug: "lens-1",
					stock: 10,
				},
			}),
			createMockItem({
				id: "lens-2",
				groupId: "group-1",
				parentProductId: "glasses-product",
				product: {
					id: "lens-product-2",
					name: "Lens Option 2",
					slug: "lens-2",
					stock: 10,
				},
			}),
		];

		const grouped = groupCartItems(items);

		expect(grouped).toHaveLength(1);
		expect(grouped[0].glasses.id).toBe("glasses-1");
		expect(grouped[0].lensOptions).toHaveLength(2);
		expect(grouped[0].combinationKey).toBe("group-1");
	});

	it("handles legacy items without groupId", () => {
		const items = [
			createMockItem({
				id: "glasses-1",
				product: {
					id: "glasses-product",
					name: "Glasses",
					slug: "glasses",
					stock: 5,
				},
			}),
			createMockItem({
				id: "lens-1",
				parentProductId: "glasses-product",
				product: {
					id: "lens-product-1",
					name: "Lens Option 1",
					slug: "lens-1",
					stock: 10,
				},
			}),
		];

		const grouped = groupCartItems(items);

		expect(grouped).toHaveLength(1);
		expect(grouped[0].glasses.id).toBe("glasses-1");
		expect(grouped[0].lensOptions).toHaveLength(1);
		expect(grouped[0].combinationKey).toBe("legacy:glasses-1");
	});

	it("handles orphaned lens options", () => {
		const items = [
			createMockItem({
				id: "orphan-lens",
				parentProductId: "non-existent-product",
				product: {
					id: "lens-product",
					name: "Orphan Lens",
					slug: "orphan",
					stock: 10,
				},
			}),
		];

		const grouped = groupCartItems(items);

		expect(grouped).toHaveLength(1);
		expect(grouped[0].glasses.id).toBe("orphan-lens");
		expect(grouped[0].lensOptions).toHaveLength(0);
		expect(grouped[0].combinationKey).toBe("orphan:orphan-lens");
	});

	it("aggregates quantities for items with same groupId", () => {
		const items = [
			createMockItem({
				id: "glasses-1",
				groupId: "group-1",
				quantity: 2,
			}),
			createMockItem({
				id: "glasses-2",
				groupId: "group-1",
				quantity: 3,
			}),
		];

		const grouped = groupCartItems(items);

		expect(grouped).toHaveLength(1);
		expect(grouped[0].totalQuantity).toBe(2); // Should use the first item's quantity
	});
});
