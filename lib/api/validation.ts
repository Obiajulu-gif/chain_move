import { NextResponse } from "next/server"
import { z } from "zod"

function formatValidationIssues(error: z.ZodError) {
  return error.issues.slice(0, 10).map((issue) => ({
    path: issue.path.join(".") || "root",
    message: issue.message,
  }))
}

export function validationErrorResponse(message: string, error?: z.ZodError) {
  return NextResponse.json(
    {
      message,
      issues: error ? formatValidationIssues(error) : undefined,
    },
    { status: 400 },
  )
}

export async function parseJsonBody<TSchema extends z.ZodTypeAny>(
  request: Request,
  schema: TSchema,
) {
  const body = await request.json().catch(() => undefined)
  const result = schema.safeParse(body)

  if (!result.success) {
    return {
      response: validationErrorResponse("Invalid request body.", result.error),
    }
  }

  return { data: result.data as z.infer<TSchema> }
}

export function parseSearchParams<TSchema extends z.ZodTypeAny>(
  request: Request,
  schema: TSchema,
) {
  const url = new URL(request.url)
  const params: Record<string, string | string[]> = {}

  url.searchParams.forEach((value, key) => {
    const currentValue = params[key]
    if (typeof currentValue === "undefined") {
      params[key] = value
      return
    }

    params[key] = Array.isArray(currentValue) ? [...currentValue, value] : [currentValue, value]
  })

  const result = schema.safeParse(params)
  if (!result.success) {
    return {
      response: validationErrorResponse("Invalid query parameters.", result.error),
    }
  }

  return { data: result.data as z.infer<TSchema> }
}
