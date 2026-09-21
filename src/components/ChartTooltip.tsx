import type { TooltipState } from '../hooks/useChartTooltip'

/** Tooltip sirf enhancement hai — har value direct label ya table mein bhi hai. */
export function ChartTooltip({ tooltip }: { tooltip: TooltipState }) {
  if (!tooltip) return null

  return (
    <div
      className="chart-tooltip"
      role="presentation"
      style={{ left: tooltip.x, top: tooltip.y }}
    >
      <span className="chart-tooltip-label">{tooltip.label}</span>
      <span className="chart-tooltip-value">{tooltip.value}</span>
    </div>
  )
}
