ALTER TABLE "account" ALTER COLUMN "accountId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "activity" ADD COLUMN "customerId" text;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_customerId_customer_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."customer"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "activity" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "role";--> statement-breakpoint
DROP TYPE "public"."customerRole";