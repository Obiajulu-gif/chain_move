export const PHONE_NUMBER_REQUIRED_MESSAGE = "Phone number is required."
export const PHONE_NUMBER_INVALID_MESSAGE = "Enter a valid phone number."

export function normalizePhoneNumberInput(value: unknown) {
  if (typeof value !== "string") return undefined

  const trimmed = value.trim().replace(/\s+/g, " ")
  return trimmed.length > 0 ? trimmed : undefined
}

export function isReasonablePhoneNumber(value: string) {
  if (!/^\+?[0-9\s().-]+$/.test(value)) return false

  const plusSigns = value.match(/\+/g)
  if (plusSigns && (plusSigns.length > 1 || !value.startsWith("+"))) return false

  const digits = value.replace(/\D/g, "")
  return digits.length >= 7 && digits.length <= 15
}

export function validatePhoneNumberInput(
  value: unknown,
  options?: {
    required?: boolean
    allowEmpty?: boolean
  },
) {
  const normalized = normalizePhoneNumberInput(value)

  if (!normalized) {
    if (options?.allowEmpty) {
      return { value: undefined as string | undefined, error: null as string | null }
    }

    if (options?.required) {
      return { value: undefined as string | undefined, error: PHONE_NUMBER_REQUIRED_MESSAGE }
    }

    return { value: undefined as string | undefined, error: null as string | null }
  }

  if (!isReasonablePhoneNumber(normalized)) {
    return { value: undefined as string | undefined, error: PHONE_NUMBER_INVALID_MESSAGE }
  }

  return { value: normalized, error: null as string | null }
}
