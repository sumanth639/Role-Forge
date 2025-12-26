ALTER TABLE "messages" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."message_role";--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('USER', 'model');--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "role" SET DATA TYPE "public"."message_role" USING "role"::"public"."message_role";