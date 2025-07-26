ALTER TABLE "product" DROP CONSTRAINT "product_subcategoryId_subcategory_id_fk";
--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_subcategoryId_subcategory_id_fk" FOREIGN KEY ("subcategoryId") REFERENCES "public"."subcategory"("id") ON DELETE set null ON UPDATE no action;