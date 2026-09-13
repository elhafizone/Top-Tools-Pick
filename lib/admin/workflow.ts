import type { PublicationStatus } from "@prisma/client";

export const workflowStatuses = ["DRAFT", "REVIEW", "PUBLISHED"] as const;
export type WorkflowStatus = (typeof workflowStatuses)[number];

export function allowedWorkflowStatuses(from: PublicationStatus): WorkflowStatus[] {
  if (from === "ARCHIVED") return ["DRAFT"];
  return {
    DRAFT: ["DRAFT", "REVIEW"],
    REVIEW: ["REVIEW", "PUBLISHED", "DRAFT"],
    PUBLISHED: ["PUBLISHED", "DRAFT"],
  }[from as WorkflowStatus] as WorkflowStatus[];
}

export function parseWorkflowStatus(value: unknown): WorkflowStatus | null {
  return typeof value === "string" && workflowStatuses.includes(value as WorkflowStatus)
    ? value as WorkflowStatus
    : null;
}

export function assertTransition(from: PublicationStatus, to: WorkflowStatus) {
  if (from === "ARCHIVED") {
    if (to !== "DRAFT") throw new Error(`Invalid publication transition: ${from} -> ${to}`);
    return;
  }
  if (!allowedWorkflowStatuses(from).includes(to)) throw new Error(`Invalid publication transition: ${from} -> ${to}`);
}

/**
 * `publishedAt` records when an item FIRST went live. Re-stamping it on every save
 * re-dated published content and reshuffled the public listings on a typo fix.
 */
export function nextPublishedAt(status: WorkflowStatus, current: Date | null) {
  if (status !== "PUBLISHED") return current;
  return current ?? new Date();
}

export function assertPublishable(fields: Record<string, unknown>) {
  const required = ["title", "slug", "description", "seoTitle", "seoDescription"];
  if (required.some((field) => typeof fields[field] !== "string" || !(fields[field] as string).trim())) {
    throw new Error("Published content requires title, slug, description, SEO title, and SEO description.");
  }
}
