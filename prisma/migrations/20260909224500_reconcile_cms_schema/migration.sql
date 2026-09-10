-- Non-destructive reconciliation for the existing database.
-- This migration intentionally adds only new enums, nullable CMS fields,
-- safe-default workflow fields, AuditLog, and supporting indexes.

CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'REORDER', 'PUBLISH', 'UNPUBLISH', 'DELETE');

ALTER TYPE "PublicationStatus" ADD VALUE 'REVIEW';

ALTER TABLE "Article"
  ADD COLUMN "canonicalUrl" TEXT;

ALTER TABLE "Category"
  ADD COLUMN "seoDescription" TEXT,
  ADD COLUMN "seoTitle" TEXT,
  ADD COLUMN "status" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED';

ALTER TABLE "Comparison"
  ADD COLUMN "description" TEXT,
  ADD COLUMN "seoDescription" TEXT,
  ADD COLUMN "seoTitle" TEXT,
  ADD COLUMN "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT';

ALTER TABLE "Story"
  ADD COLUMN "seoDescription" TEXT,
  ADD COLUMN "seoTitle" TEXT;

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "action" "AuditAction" NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "adminUsername" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx"
  ON "AuditLog"("entityType", "entityId", "createdAt");

CREATE INDEX "AuditLog_createdAt_idx"
  ON "AuditLog"("createdAt");
