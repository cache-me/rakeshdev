-- Combined Drizzle migrations for Supabase SQL Editor
-- Dashboard → SQL → New query → paste → Run

-- ========== 0000_cold_tenebrous.sql ==========
CREATE TABLE "ai_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"messages" text DEFAULT '[]' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"published_at" timestamp with time zone,
	"category_id" uuid,
	"cover_image_url" text,
	"search_text" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);

CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(254) NOT NULL,
	"subject" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"ip_hash" varchar(64),
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution" varchar(200) NOT NULL,
	"degree" varchar(200) NOT NULL,
	"start_date" varchar(20),
	"end_date" varchar(20),
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" varchar(200) NOT NULL,
	"role" varchar(200) NOT NULL,
	"location" varchar(120),
	"start_date" varchar(20) NOT NULL,
	"end_date" varchar(20),
	"current" boolean DEFAULT false NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"search_text" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "project_technologies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"technology" varchar(80) NOT NULL
);

CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"summary" text NOT NULL,
	"body" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"status" varchar(40) DEFAULT 'published' NOT NULL,
	"cover_image_url" text,
	"demo_url" text,
	"repo_url" text,
	"started_at" varchar(20),
	"completed_at" varchar(20),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"search_text" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);

CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"icon_key" varchar(80),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"search_text" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"title" varchar(200) NOT NULL,
	"tagline" text NOT NULL,
	"bio" text NOT NULL,
	"hero_intro" text NOT NULL,
	"profile_image_url" text,
	"resume_url" text,
	"email" varchar(254),
	"location" varchar(120),
	"availability" text,
	"now_content" text,
	"social_links" text DEFAULT '{}' NOT NULL,
	"seo_title" varchar(200),
	"seo_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"category" varchar(80) NOT NULL,
	"proficiency" integer DEFAULT 3 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"search_text" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author" varchar(120) NOT NULL,
	"role" varchar(120),
	"quote" text NOT NULL,
	"avatar_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);

CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);

CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"role" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);

CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);

ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
CREATE INDEX "experience_sort_idx" ON "experience" USING btree ("sort_order");
CREATE INDEX "project_tech_project_idx" ON "project_technologies" USING btree ("project_id");
CREATE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
CREATE INDEX "projects_featured_idx" ON "projects" USING btree ("featured");
CREATE INDEX "skills_category_idx" ON "skills" USING btree ("category");
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");

-- ========== 0001_better_auth_admin.sql ==========
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banned" boolean DEFAULT false NOT NULL;

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "ban_reason" text;

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "ban_expires" timestamp with time zone;

ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "impersonated_by" text;

-- ========== 0002_account_issuer.sql ==========
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "issuer" text;

UPDATE "account" SET "issuer" = 'local:credential' WHERE "provider_id" = 'credential' AND ("issuer" IS NULL OR "issuer" = '');

UPDATE "account" SET "issuer" = 'local:oauth:' || "provider_id" WHERE "provider_id" <> 'credential' AND ("issuer" IS NULL OR "issuer" = '');

ALTER TABLE "account" ALTER COLUMN "issuer" SET NOT NULL;

-- ========== 0003_education_qualifications.sql ==========
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "qualification_type" varchar(40) DEFAULT 'degree' NOT NULL;
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "board_or_issuer" varchar(200);
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "result_summary" text;
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "certificate_url" text;
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "subjects_json" text DEFAULT '[]' NOT NULL;
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "metrics_json" text DEFAULT '{}' NOT NULL;

-- ========== 0004_personal_documents.sql ==========
CREATE TABLE IF NOT EXISTS "personal_documents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "doc_type" varchar(40) NOT NULL,
  "title" varchar(200) NOT NULL,
  "description" text,
  "storage_path" text NOT NULL,
  "mime_type" varchar(80) DEFAULT 'image/png' NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "personal_document_access_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "token_hash" varchar(64) NOT NULL UNIQUE,
  "expires_at" timestamp with time zone NOT NULL,
  "created_by_user_id" text,
  "label" varchar(120),
  "revoked_at" timestamp with time zone,
  "last_accessed_at" timestamp with time zone,
  "access_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "personal_doc_tokens_expires_idx" ON "personal_document_access_tokens" ("expires_at");

