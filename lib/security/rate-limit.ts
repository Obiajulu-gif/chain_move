import { NextResponse } from "next/server"

type RateLimitBucket = {
  count: number
  resetAt: number
}

declare global {
  var __chainMoveRateLimitBuckets__: Map<string, RateLimitBucket> | undefined
}

function getRateLimitStore() {
  if (!globalThis.__chainMoveRateLimitBuckets__) {
    globalThis.__chainMoveRateLimitBuckets__ = new Map()
  }

  return globalThis.__chainMoveRateLimitBuckets__
}

function sweepExpiredBuckets(now: number) {
  const store = getRateLimitStore()
  if (store.size < 5000) return

  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) {
      store.delete(key)
    }
  }
}

export function getClientIpAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const [firstHop] = forwarded.split(",")
    if (firstHop?.trim()) return firstHop.trim()
  }

  const realIp = request.headers.get("x-real-ip")
  if (realIp?.trim()) return realIp.trim()

  const cloudflareIp = request.headers.get("cf-connecting-ip")
  if (cloudflareIp?.trim()) return cloudflareIp.trim()

  return "unknown"
}

export function buildRateLimitKey(prefix: string, ...segments: Array<string | number | null | undefined>) {
  return [prefix, ...segments.map((segment) => String(segment || "unknown"))].join(":")
}

export function consumeRateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string
  limit: number
  windowMs: number
}) {
  const now = Date.now()
  sweepExpiredBuckets(now)

  const store = getRateLimitStore()
  const bucket = store.get(key)

  if (!bucket || bucket.resetAt <= now) {
    const nextBucket = { count: 1, resetAt: now + windowMs }
    store.set(key, nextBucket)
    return {
      allowed: true,
      remaining: Math.max(limit - 1, 0),
      resetAt: nextBucket.resetAt,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    }
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    }
  }

  bucket.count += 1
  store.set(key, bucket)

  return {
    allowed: true,
    remaining: Math.max(limit - bucket.count, 0),
    resetAt: bucket.resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  }
}

export function rateLimitExceededResponse(result: {
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}) {
  const response = NextResponse.json(
    { message: "Too many requests. Please try again later." },
    { status: 429 },
  )

  response.headers.set("Retry-After", String(result.retryAfterSeconds))
  response.headers.set("X-RateLimit-Remaining", String(result.remaining))
  response.headers.set("X-RateLimit-Reset", String(result.resetAt))

  return response
}
