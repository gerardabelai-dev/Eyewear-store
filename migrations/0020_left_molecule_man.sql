ALTER TABLE "orderDelivery" ADD COLUMN "estimatedDeliveryDays" integer;--> statement-breakpoint
ALTER TABLE "orderDelivery" ADD COLUMN "trackingCode" text;--> statement-breakpoint
ALTER TABLE "orderPayment" ADD COLUMN "subtotalInCents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orderPayment" ADD COLUMN "shippingCostInCents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orderPayment" ADD COLUMN "taxInCents" integer DEFAULT 0 NOT NULL;