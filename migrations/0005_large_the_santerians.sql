CREATE TYPE "public"."orderStatus" AS ENUM('pending', 'paid', 'cancelled');--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "customerId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "customerAddressId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "orderStatus" "orderStatus" DEFAULT 'pending' NOT NULL;