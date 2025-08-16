import { customAlphabet } from "nanoid";

const tableNameToPrefix = {
	// Better-auth tables
	user: "usr",
	session: "ses",
	account: "acc",
	verification: "ver",

	// Customer
	customer: "cus",
	customerAddress: "adr",

	// Product
	product: "pro",
	productImage: "img",
	productPrice: "pri",

	// Category
	category: "cat",
	categorySecondary: "cas",

	// Order
	order: "ord",
	orderProduct: "orp",
	orderDeliveryMethod: "odm",
	orderDelivery: "del",
	orderPayment: "pay",

	// Activity
	activity: "act",

	// Cart
	cart: "crt",
	cartProduct: "crp",
};

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 6);

export function generatePrefixId(tableName: keyof typeof tableNameToPrefix) {
	return `${tableNameToPrefix[tableName]}_${nanoid()}`;
}
