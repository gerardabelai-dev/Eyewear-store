DROP TABLE "orderProduct" CASCADE;--> statement-breakpoint
ALTER TABLE "customerAddress" ADD COLUMN "hasNoNumber" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "customerAddress" ADD COLUMN "hasNoComplement" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "customerAddress" ADD COLUMN "hasNozipCode" boolean DEFAULT false NOT NULL;