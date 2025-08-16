CREATE TABLE "orderPaymentMethod" (
	"id" text PRIMARY KEY NOT NULL,
	"method" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orderPayment" ADD COLUMN "orderPaymentMethodId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orderPayment" ADD CONSTRAINT "orderPayment_orderPaymentMethodId_orderPaymentMethod_id_fk" FOREIGN KEY ("orderPaymentMethodId") REFERENCES "public"."orderPaymentMethod"("id") ON DELETE set null ON UPDATE no action;