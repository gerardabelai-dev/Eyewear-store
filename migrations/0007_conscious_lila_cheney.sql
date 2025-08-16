ALTER TABLE "orderPayment" ADD COLUMN "totalPriceInCents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "totalPriceInCents";