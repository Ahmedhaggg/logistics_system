CREATE TYPE "public"."status" AS ENUM('ONLINE', 'OFFLINE', 'ON_CALL');--> statement-breakpoint
CREATE TABLE "users_statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "status" NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_statuses_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users_statuses" ADD CONSTRAINT "users_statuses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;