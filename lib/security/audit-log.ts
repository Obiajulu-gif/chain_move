import dbConnect from "@/lib/dbConnect"
import AuditLog from "@/models/AuditLog"

type AuditActor = {
  _id?: { toString(): string }
  role?: string
} | null

function sanitizeMetadata(metadata: Record<string, unknown> | undefined) {
  if (!metadata) return undefined

  return JSON.parse(JSON.stringify(metadata)) as Record<string, unknown>
}

export async function logAuditEvent({
  actor,
  action,
  targetType,
  targetId,
  status = "success",
  ipAddress,
  metadata,
}: {
  actor?: AuditActor
  action: string
  targetType: string
  targetId?: string | null
  status?: "success" | "failure"
  ipAddress?: string | null
  metadata?: Record<string, unknown>
}) {
  try {
    await dbConnect()
    await AuditLog.create({
      actorId: actor?._id?.toString() || undefined,
      actorRole:
        actor?.role === "admin" || actor?.role === "driver" || actor?.role === "investor"
          ? actor.role
          : undefined,
      action,
      targetType,
      targetId: targetId || undefined,
      status,
      ipAddress: ipAddress || undefined,
      metadata: sanitizeMetadata(metadata),
    })
  } catch (error) {
    console.error("AUDIT_LOG_WRITE_ERROR", error)
  }
}
