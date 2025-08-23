ALTER TABLE "orderPayment" ADD COLUMN "stripePaymentIntentId" text;--> statement-breakpoint
ALTER TABLE "orderPayment" ADD COLUMN "stripeClientSecret" text;--> statement-breakpoint
ALTER TABLE "orderPayment" ADD COLUMN "stripePaymentMethodId" text;