import { useCallback, useState } from 'react'

export type TooltipState = {
  label: string
  value: string
  x: number
  y: number
} | null

/**
 * Hover aur keyboard focus dono ek hi tooltip kholte hain — tooltip value
 * padhne ka ekmatra rasta nahi hona chahiye, par jo dikhe wo dono ko dikhe.
 */
export function useChartTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState>(null)

  const show = useCallback(
    (event: { currentTarget: HTMLElement }, label: string, value: string) => {
      const target = event.currentTarget
      const box = target.getBoundingClientRect()
      const parent = target.closest('.chart-card')?.getBoundingClientRect()

      setTooltip({
        label,
        value,
        x: box.left - (parent?.left ?? 0) + box.width / 2,
        y: box.top - (parent?.top ?? 0),
      })
    },
    [],
  )

  const hide = useCallback(() => setTooltip(null), [])

  return { tooltip, show, hide }
}
