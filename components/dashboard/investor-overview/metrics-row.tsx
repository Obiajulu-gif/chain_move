"use client"

export interface OverviewMetricItem {
  id: string
  label: string
  value: string
  accentValue?: string
  hint: string
}

interface MetricsRowProps {
  metrics: OverviewMetricItem[]
}

export function MetricsRow({ metrics }: MetricsRowProps) {
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.id} className="h-full rounded-[10px] border border-border/70 bg-card px-4 py-4 md:px-4">
          <p className="text-[13px] text-muted-foreground">{metric.label}</p>

          <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
            <p className="text-lg font-semibold leading-none text-foreground md:text-xl">{metric.value}</p>
            {metric.accentValue ? <p className="text-lg font-semibold leading-none text-emerald-600 dark:text-emerald-400 md:text-xl">{metric.accentValue}</p> : null}
          </div>

          <p className="mt-2 text-xs text-muted-foreground">{metric.hint}</p>
        </article>
      ))}
    </section>
  )
}
