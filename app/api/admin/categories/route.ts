import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { recordAudit } from "@/lib/admin/audit";
import { parseWorkflowStatus, assertPublishable } from "@/lib/admin/workflow";
import { adminErrorResponse, adminFormErrorResponse } from "@/lib/admin/response";
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
export async function POST(request: Request) { try { await requireAdmin(); const body = Object.fromEntries((await request.formData()).entries()); const name = text(body.name); const slug = text(body.slug); const description = text(body.description); const status = body.status === undefined ? ("DRAFT" as const) : parseWorkflowStatus(body.status); if (!status || !name || !slug || !description) return adminFormErrorResponse(request, "/admin/categories/new", "Name, slug, description, and a valid status are required.", 400); if (status === "PUBLISHED") assertPublishable({ title: name, slug, description, seoTitle: text(body.seoTitle), seoDescription: text(body.seoDescription) }); const category = await prisma.category.create({ data: { name, slug, description, seoTitle: text(body.seoTitle) || null, seoDescription: text(body.seoDescription) || null, status } }); await recordAudit("CREATE", "Category", category.id, { slug, status }); return NextResponse.redirect(new URL("/admin/categories", request.url), { status: 303 }); } catch (error) { return adminErrorResponse(error, "Unable to create category.", request, "/admin/categories/new"); } }
