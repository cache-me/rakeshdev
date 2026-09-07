ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "qualification_type" varchar(40) DEFAULT 'degree' NOT NULL;
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "board_or_issuer" varchar(200);
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "result_summary" text;
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "certificate_url" text;
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "subjects_json" text DEFAULT '[]' NOT NULL;
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "metrics_json" text DEFAULT '{}' NOT NULL;
