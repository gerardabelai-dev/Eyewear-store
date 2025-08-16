ALTER TABLE "order" DROP CONSTRAINT "order_orderDeliveryMethodId_orderDeliveryMethod_id_fk";
--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "orderDeliveryMethodId";