export const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
})

export function formatNaira(value: number | string | null | undefined): string {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : 0

  if (!Number.isFinite(numericValue)) {
    return nairaFormatter.format(0)
  }

  return nairaFormatter.format(numericValue)
}

export function formatPercent(value: number | null | undefined, fractionDigits = 1): string {
  if (!Number.isFinite(value ?? NaN)) {
    return "0.0%"
  }

  return `${(value as number).toFixed(fractionDigits)}%`
}
