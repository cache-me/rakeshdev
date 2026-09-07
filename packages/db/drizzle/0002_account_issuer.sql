ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "issuer" text;
--> statement-breakpoint
UPDATE "account" SET "issuer" = 'local:credential' WHERE "provider_id" = 'credential' AND ("issuer" IS NULL OR "issuer" = '');
--> statement-breakpoint
UPDATE "account" SET "issuer" = 'local:oauth:' || "provider_id" WHERE "provider_id" <> 'credential' AND ("issuer" IS NULL OR "issuer" = '');
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "issuer" SET NOT NULL;
