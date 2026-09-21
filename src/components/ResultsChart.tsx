import { ChartCard } from './ChartCard'
import { ChartTooltip } from './ChartTooltip'
import { useChartTooltip } from '../hooks/useChartTooltip'
import { outcomeCounts } from '../game/records'
import { percentOf, stack } from '../lib/chart'
import { percent } from '../lib/format'
import type { GameRecord } from '../types/game'

type Props = {
  log: GameRecord[]
}

/**
 * Part-to-whole — isliye horizontal stacked bar, pie nahi. Teen series hain,
 * toh legend ke saath direct labels bhi safe hain.
 */
export function ResultsChart({ log }: Props) {
  const { tooltip, show, hide } = useChartTooltip()
  const counts = outcomeCounts(log)

  const series = [
    { key: 'X', label: 'X wins', value: counts.X, slot: 1 },
    { key: 'O', label: 'O wins', value: counts.O, slot: 2 },
    { key: 'draws', label: 'Draws', value: counts.draws, slot: 3 },
  ]

  const total = log.length
  const segments = stack(series.map((s) => s.value))

  const table = (
    <table>
      <thead>
        <tr>
          <th scope="col">Outcome</th>
          <th scope="col">Games</th>
          <th scope="col">Share</th>
        </tr>
      </thead>
      <tbody>
        {series.map((s) => (
          <tr key={s.key}>
            <th scope="row">{s.label}</th>
            <td>{s.value}</td>
            <td>{percent(percentOf(s.value, total) / 100)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <ChartCard
      title="Results"
      subtitle={total === 0 ? 'No games yet' : `Last ${total} games`}
      table={table}
    >
      {total === 0 ? (
        <p className="muted chart-empty">Finish a round and it shows up here.</p>
      ) : (
        <>
          <div className="stack-bar" role="img" aria-label={
            series.map((s) => `${s.label}: ${s.value}`).join(', ')
          }>
            {series.map((s, i) =>
              segments[i].size === 0 ? null : (
                <button
                  key={s.key}
                  type="button"
                  className={`stack-segment slot-${s.slot}`}
                  style={{ width: `${segments[i].size}%` }}
                  onMouseEnter={(e) => show(e, s.label, `${s.value} games`)}
                  onMouseLeave={hide}
                  onFocus={(e) => show(e, s.label, `${s.value} games`)}
                  onBlur={hide}
                >
                  <span className="sr-only">{`${s.label}: ${s.value}`}</span>
                </button>
              ),
            )}
          </div>

          {/* Legend hamesha — pehchaan kabhi sirf colour se na aaye. */}
          <ul className="chart-legend">
            {series.map((s) => (
              <li key={s.key}>
                <span className={`legend-swatch slot-${s.slot}`} aria-hidden="true" />
                {s.label}
                <span className="legend-value">{s.value}</span>
              </li>
            ))}
          </ul>

          <ChartTooltip tooltip={tooltip} />
        </>
      )}
    </ChartCard>
  )
}
