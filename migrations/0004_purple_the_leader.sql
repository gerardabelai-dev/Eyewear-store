ALTER TABLE "cartProduct" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "cartProduct" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;