import { customAlphabet } from "nanoid";

const tableNameToPrefix = {
	user: "usr",
	session: "ses",
	account: "acc",
	verification: "ver",
	customer: "cus",
	customerAddress: "adr",
	product: "pro",
	productImage: "img",
	productPrice: "pri",
	category: "cat",
	categorySecondary: "cas",
	order: "ord",
	orderProduct: "orp",
	orderDelivery: "del",
	orderPayment: "pay",
	activity: "act",
};

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 6);

export function generatePrefixId(tableName: keyof typeof tableNameToPrefix) {
	return `${tableNameToPrefix[tableName]}_${nanoid()}`;
}
