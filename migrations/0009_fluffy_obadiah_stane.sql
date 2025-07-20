CREATE TABLE "order_status" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"color" text DEFAULT '#6b7280' NOT NULL,
	"icon" text DEFAULT 'Package',
	"is_default" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_status_name_unique" UNIQUE("name"),
	CONSTRAINT "order_status_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "statusId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_statusId_order_status_id_fk" FOREIGN KEY ("statusId") REFERENCES "public"."order_status"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "status";