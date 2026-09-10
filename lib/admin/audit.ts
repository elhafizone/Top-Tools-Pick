import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { adminCookieName, getAdminUsername } from "@/lib/admin/auth";
import type { PrismaClient } from "@prisma/client";

export async function recordAudit(action: "CREATE" | "UPDATE" | "REORDER" | "PUBLISH" | "UNPUBLISH" | "DELETE", entityType: string, entityId: string, metadata?: Prisma.InputJsonValue) {
  const username = getAdminUsername((await cookies()).get(adminCookieName)?.value);
  if (!username) throw new Error("Unauthorized");
  await prisma.auditLog.create({ data: { action, entityType, entityId, adminUsername: username, metadata: metadata ?? undefined } });
}

export async function recordAuditWithClient(client: PrismaClient | Prisma.TransactionClient, action: "CREATE" | "UPDATE" | "REORDER" | "PUBLISH" | "UNPUBLISH" | "DELETE", entityType: string, entityId: string, metadata?: Prisma.InputJsonValue) {
  const username = getAdminUsername((await cookies()).get(adminCookieName)?.value);
  if (!username) throw new Error("Unauthorized");
  await client.auditLog.create({ data: { action, entityType, entityId, adminUsername: username, metadata: metadata ?? undefined } });
}
