ALTER TABLE "product" DROP CONSTRAINT "product_categoryId_category_id_fk";
--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "categoryId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;