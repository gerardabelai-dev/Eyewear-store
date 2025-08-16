CREATE TABLE "orderDeliveryMethod" (
	"id" text PRIMARY KEY NOT NULL,
	"method" text NOT NULL,
	"costInCents" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orderDelivery" ADD COLUMN "orderDeliveryMethodId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orderDelivery" ADD CONSTRAINT "orderDelivery_orderDeliveryMethodId_orderDeliveryMethod_id_fk" FOREIGN KEY ("orderDeliveryMethodId") REFERENCES "public"."orderDeliveryMethod"("id") ON DELETE set null ON UPDATE no action;