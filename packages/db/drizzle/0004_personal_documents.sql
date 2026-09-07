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
