import { db } from "@/lib/db";
import { orderStatus } from "@/lib/db/schema";

export async function getOrderStatusesQuery() {
	return db.select().from(orderStatus).orderBy(orderStatus.name);
}
