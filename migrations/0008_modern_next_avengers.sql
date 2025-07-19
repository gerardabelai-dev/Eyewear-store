CREATE TABLE "user_notification" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"notification_type" text NOT NULL,
	"channel" text NOT NULL,
	"subject" text,
	"content" text,
	"metadata" json DEFAULT '{}'::json,
	"external_id" text,
	"external_provider" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"opened_at" timestamp,
	"clicked_at" timestamp,
	"failed_at" timestamp,
	"failure_reason" text,
	"unsubscribe_token" text,
	"unsubscribed_at" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_notification_unsubscribe_token_unique" UNIQUE("unsubscribe_token")
);
--> statement-breakpoint
CREATE TABLE "user_notification_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"marketing" boolean DEFAULT true NOT NULL,
	"order_updates" boolean DEFAULT true NOT NULL,
	"system_notifications" boolean DEFAULT true NOT NULL,
	"promotions" boolean DEFAULT true NOT NULL,
	"newsletters" boolean DEFAULT true NOT NULL,
	"email_enabled" boolean DEFAULT true NOT NULL,
	"sms_enabled" boolean DEFAULT false NOT NULL,
	"push_enabled" boolean DEFAULT true NOT NULL,
	"whatsapp_enabled" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_notification_settings_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD CONSTRAINT "user_notification_settings_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;